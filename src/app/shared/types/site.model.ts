import { CanReferenceCompanyLevel } from "./reference.model";

export interface Site extends CanReferenceCompanyLevel {
    id: string;
    name: string;
    address: string;
    local_tax_rate: number;
    business_hours: {
        start: Date;
        end: Date;
    };
    created_at: Date;
    updated_at: Date;
}