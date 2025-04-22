export const JOBS = [
    {
        jobId: "job-001",
        service: "email-sender",
        status: "done",
        payload: { recipients: 150, template: "welcome" },
        response: { sent: 150, failed: 0 },
        createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
        jobId: "job-002",
        service: "data-processor",
        status: "processing",
        payload: { dataSize: "2.5GB", format: "CSV" },
        createdAt: new Date(Date.now() - 1800000).toISOString()
    },
    {
        jobId: "job-003",
        service: "notification-service",
        status: "failed",
        payload: { userId: "user123", message: "Important update" },
        response: { error: "Service unavailable" },
        createdAt: new Date(Date.now() - 7200000).toISOString()
    },
    {
        jobId: "job-004",
        service: "data-backup",
        status: "pending",
        payload: { source: "main-database", destination: "cloud-storage" },
        createdAt: new Date(Date.now() - 300000).toISOString()
    }
]