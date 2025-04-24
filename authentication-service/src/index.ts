import "dotenv/config";
import app from "./app";
import { PORT } from "./env";
import cors from "cors";

app.use(cors({
  origin: '*',
  credentials: true,
}))

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
