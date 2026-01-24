import express from "express";
import type { Application } from "express";
import dotenv from "dotenv";
import { CreateTransaction } from "./Controllers/TransactionController.ts";

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT_NUMBER || "3000", 10);

app.use(express.json());

app.post("/transactions/add", CreateTransaction);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
