import express from 'express'
import { CreateTransaction, RetrieveUsersTransactions, updateUserTransction, deleteUsersTransaction, weeklyTransactions } from '../Controller/TransactionController';
import {verifiedRoute} from "../Controller/AuthController"
const router = express.Router()


router.post("/transactions/add",verifiedRoute, CreateTransaction);
router.get("/transactions", verifiedRoute, RetrieveUsersTransactions )
router.put("/transactions/:transactionId",verifiedRoute, updateUserTransction)
router.delete("/transactions/:transactionId",verifiedRoute, deleteUsersTransaction)
router.get("/transactions/weekly",verifiedRoute, weeklyTransactions)

export default  {router}





