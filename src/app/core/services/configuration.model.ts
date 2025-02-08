import { CanReferenceCompanyLevel } from "@shared/types/reference.model";

export interface ItemRelation {
    itemId: string;
    childItemIds?: Array<string>;
    modifierIds?: Array<string>;
}

export interface MenuRelation extends CanReferenceCompanyLevel {
    menuId: string;
    categoryRelations: Array<{
        categoryId: string;
        categoryName: string;
        itemRelations: ItemRelation[]
    }>
}