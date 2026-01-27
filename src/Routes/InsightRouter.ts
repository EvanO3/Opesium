import express from "express"
import { verifiedRoute } from "../Controller/AuthController";
import {generateInsights} from "../Controller/InsightController"

const router = express.Router()


router.get("/insight/weekly",verifiedRoute, generateInsights)

export default {router}