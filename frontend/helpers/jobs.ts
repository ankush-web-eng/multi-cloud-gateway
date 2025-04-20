export const JOBS = [
    {
        JobID: "job-001",
        Service: "email-sender",
        Status: "done",
        Payload: { recipients: 150, template: "welcome" },
        Response: { sent: 150, failed: 0 },
        CreatedAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
        JobID: "job-002",
        Service: "data-processor",
        Status: "processing",
        Payload: { dataSize: "2.5GB", format: "CSV" },
        CreatedAt: new Date(Date.now() - 1800000).toISOString()
    },
    {
        JobID: "job-003",
        Service: "notification-service",
        Status: "failed",
        Payload: { userId: "user123", message: "Important update" },
        Response: { error: "Service unavailable" },
        CreatedAt: new Date(Date.now() - 7200000).toISOString()
    },
    {
        JobID: "job-004",
        Service: "data-backup",
        Status: "pending",
        Payload: { source: "main-database", destination: "cloud-storage" },
        CreatedAt: new Date(Date.now() - 300000).toISOString()
    }
]