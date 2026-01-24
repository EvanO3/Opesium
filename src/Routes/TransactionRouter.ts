import express from 'express'
import { CreateTransaction } from '../Controller/TransactionController';
import {verifiedRoute} from "../Controller/AuthController"
const router = express.Router()


router.post("/transactions/add",verifiedRoute, CreateTransaction);


export default {router}





