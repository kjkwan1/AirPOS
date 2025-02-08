export interface CanReferenceCompanyLevel {
    company_id: string;
}

export interface CanReferenceSiteLevel extends CanReferenceCompanyLevel {
    site_id: string;
}

export interface CanReferenceUser extends CanReferenceSiteLevel {
    user_id: string;
    role_id: string;
}