import express from "express";
import dotenv from "dotenv";
import { CreateTransaction } from "./Controllers/TransactionController.ts";
const router = express.Router();
dotenv.config();
const PORT = parseInt(process.env.PORT_NUMBER || "3000", 10);
const app = express();
router.post("transactions/add", CreateTransaction);
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
