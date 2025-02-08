import { CanReferenceSiteLevel } from "./reference.model";

export interface Device extends CanReferenceSiteLevel {
    id: string;
    name: string;
    last_synced: Date;
    device_info: string;
}