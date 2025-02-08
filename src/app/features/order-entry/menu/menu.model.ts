import { OrderItem } from "@shared/types/order.model";

export type Menu = Category[];

export interface Category {
    id: string;
    name: string;
    items: OrderItem[];
}