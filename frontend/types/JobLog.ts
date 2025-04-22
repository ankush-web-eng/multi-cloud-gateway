export interface JobLog {
    jobId: string;
    service: string;
    status: string;
    payload: any;
    response?: any;
    createdAt: string;
}