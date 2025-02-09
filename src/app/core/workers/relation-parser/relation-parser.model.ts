import { ItemRelation, MenuRelation } from "@core/services/configuration.model";
import { Category, Menu } from "@features/order-entry/menu/menu.model";
import { Result } from "@shared/types/functional.type";
import { ChildItem, Item } from "@shared/types/item.model";
import { Modifier } from "@shared/types/modifier.model";
import { Rule } from "@shared/types/rule.model";

export type RelationParserMessage = 
    | { type: 'INIT_MENU', payload: InitialData }
    | { type: 'UPDATE_MENU', payload: MenuUpdate };

export type RelationParserResponse =
    | { type: 'MENU_READY', menu: Menu }
    | { type: 'CATEGORY_UPDATED', category: Category }
    | { type: 'ERROR', error: Result<string, never> };

export interface InitialData {
    items: Array<Item>;
    childItems: Array<ChildItem>;
    modifiers: Array<Modifier>;
    rules: Array<Rule>;
    menu: MenuRelation;
}

export interface MenuUpdate {
    categoryId: string;
    changes: ItemRelation[];
}