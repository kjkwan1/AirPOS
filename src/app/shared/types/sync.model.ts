export interface SyncLog {
    id: string;
    device_id: string;
    sync_date: Date;
    sync_status: 'success' | 'failed';
    details: string;
}