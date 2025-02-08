import { CanReferenceCompanyLevel, CanReferenceSiteLevel } from "./reference.model";

export interface Item extends CanReferenceCompanyLevel {
    id: string;
    type: 'parent' | 'child';
    name: string;
    description: string;
    active: boolean;
    price: number;
    category: string;
    image_url: string;
    created_at: string;
    updated_at: string;
}

export interface ChildItem extends Item {
    type: 'child';
}

export interface Inventory extends CanReferenceSiteLevel {
    id: string;
    item_id: string;
    quantity: number;
    last_updated: Date;
}