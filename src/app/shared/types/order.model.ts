import { Discount } from "./discount.model";
import { ChildItem, Item } from "./item.model";
import { Modifier } from "./modifier.model";
import { Payment } from "./payment.model";

export interface Order {
    id: string;
    employeeId: string;
    createdAt: string;
    updatedAt: string;
    state: 'pending' | 'closed' | 'suspended' | 'voided' | 'refunded';
    /**
     * Total order amount, excluding or including tax as per your calculation logic.
     */
    total: number;
    /**
     * Optional overall tax amount applied to the order.
     */
    tax?: number;
    /**
     * Currency code for the order, e.g., 'USD', 'EUR'.
     */
    currency?: string;
    /**
     * The location or store identifier. Useful for multi-site operations.
     */
    location?: string;
    /**
     * Optional notes or special instructions associated with the order.
     */
    notes?: string;
    /**
     * An array of order items that includes both the base items and any configured
     * child items and modifiers.
     */
    items: OrderItem[];
    /**
     * Payment details for the order. Supports multiple payments if needed.
     */
    payments: Payment[];
    /**
     * Any discounts applied to the order.
     */
    discounts: Discount[];
    /**
     * Timestamp when the order was closed (if applicable).
     */
    closedAt?: string;
    /**
     * Timestamp when the order was refunded (if applicable).
     */
    refundedAt?: string;
}

export interface OrderItem extends Item {
    childItems: ChildItem[];
    modifiers: Modifier[];
    /**
     * Optional tax for this particular order item.
     * This can be used if tax rates differ by item.
     */
    tax?: number;
}