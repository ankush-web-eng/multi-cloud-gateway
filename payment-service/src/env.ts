import dotenv from "dotenv";
dotenv.config();

export const KAFKA_BROKER = process.env.KAFKA_BROKER || "localhost:9092"
export const JOB_STATUS_URL = process.env.JOB_STATUS_URL

//* test credentials
export const PHONEPE_MERCHANT_ID = "TESTVVUAT"
export const PHONEPE_CLIENT_ID = "TESTVVUAT_2502041721357207510164"
export const PHONEPE_CLIENT_SECRET = "ZTcxNDQyZjUtZjQ3Mi00MjJmLTgzOWYtMWZmZWQ2ZjdkMzVi"
export const PHONEPE_AUTHORIZATION_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token"
export const PHONEPE_PAYMENT_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay"
export const PHONEPE_STATUS_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order"


//* production credentials
// export const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID
// export const PHONEPE_CLIENT_ID = process.env.PHONEPE_CLIENT_ID
// export const PHONEPE_CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET
// export const PHONEPE_AUTHORIZATION_URL = process.env.PHONEPE_AUTHORIZATION_URL
// export const PHONEPE_PAYMENT_URL = process.env.PHONEPE_PAYMENT_URL
// export const PHONEPE_STATUS_URL = process.env.PHONEPE_STATUS_URL