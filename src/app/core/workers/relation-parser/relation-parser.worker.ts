import { Result, ok, error, sequence, flatMap, map, tryCatch, getOrElse } from '@shared/types/functional.type';
import { Item, ChildItem } from '@shared/types/item.model';
import { Modifier } from '@shared/types/modifier.model';
import { Rule, SelectionRule, QuantityRule, CombinationRule } from '@shared/types/rule.model';
import { Category, Menu } from '@features/order-entry/menu/menu.model';
import { ItemRelation, MenuRelation } from '@core/services/configuration.model';
import { OrderItem } from '@shared/types/order.model';
import { InitialData, MenuUpdate, RelationParserMessage } from './relation-parser.model';

type MenuState = {
  items: ReadonlyMap<string, Item>;
  childItems: ReadonlyMap<string, ChildItem>;
  modifiers: ReadonlyMap<string, Modifier>;
  rules: ReadonlyMap<string, Rule>;
};

const lookupItem = (state: MenuState, id: string): Result<string, Item> =>
  state.items.get(id)
    ? ok(state.items.get(id)!)
    : error(`Failed to look up item ${id}`);

const lookupChildItem = (state: MenuState, id: string): Result<string, ChildItem> =>
  state.childItems.get(id)
    ? ok(state.childItems.get(id)!)
    : error(`Failed to look up child item ${id}`);

const lookupModifier = (state: MenuState, id: string): Result<string, Modifier> =>
  state.modifiers.get(id)
    ? ok(state.modifiers.get(id)!)
    : error(`Failed to look up modifier ${id}`);

const lookupRule = (state: MenuState, id: string): Result<string, Rule> =>
  state.rules.get(id)
    ? ok(state.rules.get(id)!)
    : error(`Failed to look up rule ${id}`);

// Pure validation functions
const validateSelectionRule = (rule: SelectionRule): Result<string, Rule> =>
  rule.min > rule.max
    ? error(`Invalid selection range: min ${rule.min} exceeds max ${rule.max}`)
    : ok(rule);

const validateQuantityRule = (rule: QuantityRule): Result<string, Rule> =>
  rule.min > rule.max
    ? error(`Invalid quantity range: min ${rule.min} exceeds max ${rule.max}`)
    : rule.defaultQuantity && (rule.defaultQuantity < rule.min || rule.defaultQuantity > rule.max)
      ? error(`Default quantity ${rule.defaultQuantity} outside valid range`)
      : ok(rule);

const validateCombinationRule = (state: MenuState, rule: CombinationRule): Result<string, Rule> => {
  const requiredItems = (rule.conditions.requires ?? [])
    .map(id => lookupItem(state, id));

  if (requiredItems.some(r => r.type === 'error')) {
    return error('One or more required items not found');
  }

  if (rule.options?.substitutionGroups) {
    for (const group of rule.options.substitutionGroups) {
      const itemsExist = group.itemIds.map(id => lookupItem(state, id));
      if (itemsExist.some(r => r.type === 'error')) {
        return error(`Invalid items in substitution group ${group.groupId}`);
      }
    }
  }

  return ok(rule);
};

const validateRule = (state: MenuState, rule: Rule): Result<string, Rule> => {
  switch (rule.type) {
    case 'SELECTION':
      return validateSelectionRule(rule);
    case 'QUANTITY':
      return validateQuantityRule(rule);
    case 'COMBINATION':
      return validateCombinationRule(state, rule);
  }
};

const processRules = (state: MenuState, rules: Array<Rule> | undefined): Result<string, Array<Rule>> =>
  rules
    ? sequence(rules.map(rule => validateRule(state, rule)))
    : ok([]);

const buildMenuItem = (state: MenuState, relation: ItemRelation): Result<string, OrderItem> => {
  const itemResult = lookupItem(state, relation.itemId);
  if (itemResult.type === 'error') return itemResult;

  const childItems = (relation.childItemIds ?? [])
    .map(id => lookupChildItem(state, id));

  const modifiers = (relation.modifierIds ?? [])
    .map(id => lookupModifier(state, id));

  return flatMap(
    processRules(state, relation.rules?.childItemRules),
    (childItemRules) => flatMap(
      processRules(state, relation.rules?.modifierRules),
      (modifierRules) => flatMap(
        processRules(state, relation.rules?.itemRules),
        (itemRules) => ok({
          ...itemResult.value,
          childItems: childItems.flatMap(ci => ci.type === 'ok' ? [ci.value] : []),
          modifiers: modifiers.flatMap(m => m.type === 'ok' ? [m.value] : []),
          rules: {
            childItemRules,
            modifierRules,
            itemRules
          }
        })
      )
    )
  );
};

const buildCategory = (
  state: MenuState,
  relation: {
    categoryId: string;
    categoryName: string;
    itemRelations: ItemRelation[];
    displayOrder?: number;
    rules?: Array<Rule>;
  }
): Result<string, Category> =>
  flatMap(
    processRules(state, relation.rules),
    rules => map(
      sequence(relation.itemRelations.map(rel => buildMenuItem(state, rel))),
      items => ({
        id: relation.categoryId,
        name: relation.categoryName,
        displayOrder: relation.displayOrder ?? 0,
        rules,
        items
      })
    )
  );

const buildMenu = (state: MenuState, relations: MenuRelation): Result<string, Menu> =>
  flatMap(
    processRules(state, relations.rules),
    menuRules => map(
      sequence(relations.categoryRelations.map(rel => buildCategory(state, rel))),
      categories => ({
        categories,
        rules: menuRules
      })
    )
  );

const createMenuState = (data: InitialData): Result<string, MenuState> => {
  const items = new Map(data.items.map(item => [item.id, item]));

  if (items.size === 0) {
    return error('Failed to initialize items');
  }

  return ok({
    items,
    childItems: new Map(data.childItems.map(item => [item.id, item])),
    modifiers: new Map(data.modifiers.map(mod => [mod.id, mod])),
    rules: new Map(data.rules?.map(rule => [rule.id, rule]) ?? [])
  });
};

// Main processing functions
export const processMenuInit = (data: InitialData): Result<string, Menu> =>
  flatMap(
    createMenuState(data),
    state => buildMenu(state, data.menu)
  );

export const processMenuUpdate = (
  state: MenuState,
  update: MenuUpdate
): Result<string, Category> =>
  buildCategory(
    state,
    {
      categoryId: update.categoryId,
      categoryName: getOrElse(
        tryCatch(() => {
          const existing = state.items.get(update.categoryId);
          return existing?.name ?? '';
        }),
        ''
      ),
      itemRelations: update.changes,
      rules: []
    }
  );

let currentState: MenuState;

self.addEventListener('message', ({ data }: MessageEvent<RelationParserMessage>) => {
  switch (data.type) {
    case 'INIT_MENU': {
      const result = processMenuInit(data.payload);
      if (result.type === 'ok') {
        const menuState = createMenuState(data.payload);

        if (menuState.type === 'error') {
          self.postMessage({ type: 'ERROR', error: menuState.error })
        } else {
          currentState = menuState.value;
        }
      }
      self.postMessage(
        result.type === 'ok'
          ? { type: 'MENU_READY', menu: result.value }
          : { type: 'ERROR', error: result }
      );
      break;
    }
    case 'UPDATE_MENU': {
      if (!currentState) {
        self.postMessage({ type: 'ERROR', error: error('State not initialized') });
        return;
      }
      const result = processMenuUpdate(currentState, data.payload);
      self.postMessage(
        result.type === 'ok'
          ? { type: 'CATEGORY_UPDATED', category: result.value }
          : { type: 'ERROR', error: result }
      );
      break;
    }
  }
});