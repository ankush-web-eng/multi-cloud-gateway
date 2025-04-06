import "dotenv/config";
import { startConsumer } from "./consumer";

(async () => {
  try {
    await startConsumer();
    console.log("Payment service running...");
  } catch (err) {
    console.error("Failed to start:", err);
  }
})();
