export interface AuditLog {
    id: string;
    user_id: string;
    action_type: string;
    action_detail: string;
    timestamp: Date;
}