export interface PaymentMethod {
    id: string;
    name: string;
    details: string;
}

export interface Payment {
    id: string;
    reconId: string;
    createdAt: string;
    status: 'paid' | 'voided';
    amount: number;
    tip: number;
    /**
     * Optional currency code, e.g., 'USD', 'EUR'.
     */
    currency?: string;
}
