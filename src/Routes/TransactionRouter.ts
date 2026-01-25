import express from 'express'
import { CreateTransaction, RetrieveUsersTransactions, updateUserTransction } from '../Controller/TransactionController';
import {verifiedRoute} from "../Controller/AuthController"
const router = express.Router()


router.post("/transactions/add",verifiedRoute, CreateTransaction);
router.get("/transactions", verifiedRoute, RetrieveUsersTransactions )
router.put("/transactions/:transactionId",verifiedRoute, updateUserTransction)

export default {router}





