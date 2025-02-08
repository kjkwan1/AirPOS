import { CanReferenceCompanyLevel } from "./reference.model";

export interface Role extends CanReferenceCompanyLevel {
    id: string;
    role_name: string;
    description: string;
}