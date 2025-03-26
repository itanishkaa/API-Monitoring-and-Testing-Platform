export interface UrlMonitor {
    id?: string;
    url: string;
    name: string;
    status?: 'UP' | 'DOWN' | 'UNKNOWN';
    lastChecked?: string;
    responseTime?: number;
}

export type ApiResponse<T> = {
    data: T;
    error?: string;
};