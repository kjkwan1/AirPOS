import { CanReferenceCompanyLevel } from "@shared/types/reference.model";
import { Rule } from "@shared/types/rule.model";

export interface ItemRelation {
    itemId: string;
    childItemIds?: Array<string>;
    modifierIds?: Array<string>;
    rules?: {
        childItemRules?: Array<Rule>;
        modifierRules?: Array<Rule>;
        itemRules?: Array<Rule>;
    }
}

export interface MenuRelation extends CanReferenceCompanyLevel {
    menuId: string;
    categoryRelations: Array<{
        categoryId: string;
        categoryName: string;
        itemRelations: ItemRelation[];
        displayOrder?: number
        rules?: Array<Rule>;
    }>;
    rules?: Array<Rule>;
}