import { OrderItem } from "@shared/types/order.model";
import { Rule } from "@shared/types/rule.model";

export type Menu = {
    rules: Rule[];
    categories: Category[];
};

export interface Category {
    id: string;
    name: string;
    items: OrderItem[];
}