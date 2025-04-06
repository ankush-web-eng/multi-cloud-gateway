import { Kafka } from "kafkajs";
import { handlePayment } from "./handler";
import fetch from "node-fetch";
import { JOB_STATUS_URL, KAFKA_BROKER } from "./env";
import axios from "axios";

const kafka = new Kafka({ brokers: [KAFKA_BROKER as string] });
const consumer = kafka.consumer({ groupId: "payment-service" });

export async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "payment_create", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const payload = JSON.parse(message.value?.toString() || "{}");

      try {
        const result = await handlePayment(payload.data);
        await axios.post(`${JOB_STATUS_URL}/${payload.jobId}`, {
          status: "success",
          result
        }, {
          headers: { "Content-Type": "application/json" }
        });
      } catch (err: any) {
        await axios.post(`${JOB_STATUS_URL}/${payload.jobId}`, {
          status: "failed",
          error: err.message
        }, {
          headers: { "Content-Type": "application/json" }
        });
      }
    },
  });
}
