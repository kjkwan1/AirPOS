export interface Discount {
    id: string;
    name: string;
    price: {
        type: 'flat' | 'percentage';
        amount: number;
    };
    application: {
        type: 'global' | 'targeted';
        /**
         * If targeted, this is the ID of the item the discount applies to.
         */
        itemId?: string;
    }
}