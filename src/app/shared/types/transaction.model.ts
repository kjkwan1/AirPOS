import { CanReferenceUser } from "./reference.model";

export interface Transaction extends CanReferenceUser {
    id: string;
    total: number;
    tax: number;
    payment_method_id: string;
    transaction_date: Date;
    status: string;
    receipt_sent: boolean;
}

export interface TransactionItems {
    id: string;
    transaction_id: string;
    item_ids: string[];
    quantity: number;
    price: number;
    total: number;
}

export interface Receipts {
    id: string;
    transaction_id: string;
    delivery_method: 'SMS' | 'email';
    delivery_address: string;
    delivery_status: 'sent' | 'failed' | 'pending';
    delivery_date: Date;
}