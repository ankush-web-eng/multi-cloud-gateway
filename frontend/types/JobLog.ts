export interface JobLog {
    JobID: string;
    Service: string;
    Status: string;
    Payload: any;
    Response?: any;
    CreatedAt: string;
}