
import axios from "axios";
import { uuid } from "uuidv4";
import { PHONEPE_AUTHORIZATION_URL, PHONEPE_CLIENT_ID, PHONEPE_CLIENT_SECRET, PHONEPE_PAYMENT_URL, PHONEPE_STATUS_URL, REDIRECT_URL } from "./env";

export async function handlePayment(data: any): Promise<{ url: string }> {
    console.log("Received payment data:", data);
    const token = await getAuthToken();
    const paymentUrl = await createPayment(data.totalAmount, token, uuid());
    if (!paymentUrl) {
        throw new Error("Failed to create payment URL");
    }
    console.log("Received url:", paymentUrl);
    return { url: paymentUrl };
}

const getAuthToken = async () => {
    try {
        const options = {
            method: "POST",
            url: `${PHONEPE_AUTHORIZATION_URL}`,
            headers: {
                accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: {
                client_id: PHONEPE_CLIENT_ID,
                client_version: 1,
                client_secret: PHONEPE_CLIENT_SECRET,
                grant_type: 'client_credentials'
            },
        }

        const response = await axios.request(options);
        return response.data.access_token || null;
    } catch (error) {
        console.error("Error getting auth token:");
        return null;
    }
}

const createPayment = async (amount: number, access_token: string, orderId: string) => {
    try {
        const req = {
            "merchantOrderId": orderId,
            "amount": amount * 100, // Convert to paise
            "expireAfter": 1200,
            "paymentFlow": {
                "type": "PG_CHECKOUT",
                "message": "Payment message used for collect requests",
                "merchantUrls": {
                    "redirectUrl": `${REDIRECT_URL}?transactionId=${orderId}&token=${access_token}`,
                }
            }
        }

        const options = {
            method: "POST",
            url: `${PHONEPE_PAYMENT_URL}`,
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": `O-Bearer ${access_token}`
            },
            data: req,
        };

        const response = await axios.request(options);
        console.log("Payment response:", response.data);
        return response.data.redirectUrl || null;
    } catch (error) {
        console.error("Error initiating payment:", error);
        return null;
    }
}

const checkStatus = async (transactionId: string, access_token: string) => {
    try {
        const options = {
            method: "GET",
            url: `${PHONEPE_STATUS_URL}/${transactionId}/status`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `O-Bearer ${access_token}`
            }
        }

        const response = await axios.request(options);
        console.log("Payment status response:", response.data);
        return response.data.state || null;
    } catch (error) {
        console.error("Error checking payment status:", error);
        return null;
    }
}
