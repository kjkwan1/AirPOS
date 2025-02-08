import { CanReferenceSiteLevel } from "./reference.model";

export interface User extends CanReferenceSiteLevel {
    id: string;
    role_id: string;
    username: string;
    email: string;
    phone_number: string;
    password_hash: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}