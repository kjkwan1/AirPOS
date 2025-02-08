/// <reference lib="webworker" />

import { ItemRelation, MenuRelation } from "@core/services/configuration.model";
import { Category, Menu } from "@features/order-entry/menu/menu.model";
import { ChildItem, Item } from "@shared/types/item.model";
import { Modifier } from "@shared/types/modifier.model";
import { InitialData, MenuUpdate, RelationParserMessage, RelationParserResponse } from "./relation-parser.model";
import { OrderItem } from "@shared/types/order.model";
import { error, flatMap, getOrElse, map, ok, orElse, Result, sequence, tryCatch } from "@shared/types/functional.type";

type Lookups = {
  getItem: (id: string) => Result<string, Item>;
  getChildItem: (id: string) => Result<string, ChildItem>;
  getModifier: (id: string) => Result<string, Modifier>;
}

function createMenuProcessor() {
  let itemsMap: Map<string, Item> = new Map();
  let childItemsMap: Map<string, ChildItem> = new Map();
  let modifiersMap: Map<string, Modifier> = new Map();

  const createLookups = (): Lookups => ({
    getItem: (id: string) => itemsMap.get(id)
      ? ok(itemsMap.get(id)!) : error(`Failed to look up item ${id}`),

    getChildItem: (id: string) => childItemsMap.get(id)
      ? ok(childItemsMap.get(id)!) : error(`Failed to look up child item ${id}`),

    getModifier: (id: string) => modifiersMap.get(id)
      ? ok(modifiersMap.get(id)!) : error(`Failed to look up modifier ${id}`)
  });

  const buildMenuItem = (
    relation: ItemRelation,
    lookups: Lookups
  ): Result<string, OrderItem> => {
    const item = lookups.getItem(relation.itemId);
    if (item.type === 'error') return error(item.error);
    
    const childItems = (relation.childItemIds ?? []).map(id => lookups.getChildItem(id));
    const modifiers = (relation.modifierIds ?? []).map(id => lookups.getModifier(id));
  
    return ok({
      ...item.value,
      childItems: childItems.flatMap(ci => (ci.type === 'ok' ? [ci.value] : [])),
      modifiers: modifiers.flatMap(m => (m.type === 'ok' ? [m.value] : []))
    });
  }


  const buildCategory = (
    relation: {
      categoryId: string;
      categoryName: string;
      itemRelations: ItemRelation[];
    },
    lookups: Lookups
  ): Result<string, Category> =>
    map(
      sequence(relation.itemRelations.map((rel) => buildMenuItem(rel, lookups))),
      (items) => ({
        id: relation.categoryId,
        name: relation.categoryName,
        items
      })
    )

  const buildMenu = (
    relations: MenuRelation,
    lookups: Lookups
  ): Result<string, Menu> =>
    map(
      sequence(relations.categoryRelations.map((rel) => buildCategory(rel, lookups))),
      (categories) => categories
    );

  return {
    initialize(data: InitialData): Result<string, void> {
      itemsMap = new Map(data.items.map(item => [item.id, item]));
      childItemsMap = new Map(data.childItems.map(item => [item.id, item]));
      modifiersMap = new Map(data.modifiers.map(mod => [mod.id, mod]));
  
      return itemsMap.size
        ? ok(void 0)
        : error(`Failed to initialize items`)
    },

    processMenu(relations: MenuRelation): Result<string, Menu> {
      return orElse(
        buildMenu(relations, createLookups()),
        () => error('Failed to process menu after all recovery attempts')
      );
    },

    processUpdate(update: MenuUpdate): Result<string, Category> {
      return orElse(
        buildCategory(
          {
            categoryId: update.categoryId,
            categoryName: getOrElse(
              tryCatch(() => {
                const existing = itemsMap.get(update.categoryId);
                return existing?.name ?? '';
              }),
              ''
            ),
            itemRelations: update.changes
          },
          createLookups()
        ),
        () => error('Failed to process category update after all recovery attempts')
      );
    }
  };
}

function handleMessage(
  msg: RelationParserMessage,
  currentProcessor: ReturnType<typeof createMenuProcessor>
): Result<string, RelationParserResponse> {
  switch (msg.type) {
    case 'INIT_MENU': {
      return flatMap(
        currentProcessor.initialize(msg.payload),
        () => map(
          currentProcessor.processMenu(msg.payload.menu),
          (menu) => ({ type: 'MENU_READY', menu })
        )
      );
    }

    case 'UPDATE_MENU': {
      return map(
        currentProcessor.processUpdate(msg.payload),
        (category) => ({
          type: 'CATEGORY_UPDATED',
          category
        })
      );
    }
  }
}

let processor: ReturnType<typeof createMenuProcessor>;

self.addEventListener('message', ({ data }: MessageEvent<RelationParserMessage>) => {
  if (!processor) {
    processor = createMenuProcessor();
  }

  const result = handleMessage(data, processor);

  self.postMessage(
    result.type === 'ok'
      ? result.value
      : { type: 'ERROR', error: result } satisfies RelationParserResponse
  );
});