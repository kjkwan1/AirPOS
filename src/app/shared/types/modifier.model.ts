import { CanReferenceCompanyLevel } from "./reference.model";

export interface Modifier extends CanReferenceCompanyLevel {
    id: string;
    name: string;
    price: number;
}