import "dotenv/config";
import app from "./app";
import { PORT } from "./env";
import cors from "cors";

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
