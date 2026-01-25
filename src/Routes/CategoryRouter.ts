import express from "express"
import {verifiedRoute} from "../Controller/AuthController"
import {getCategories} from "../Controller/CategoryController";
const router = express.Router();


router.get("/category", verifiedRoute, getCategories)

export default {router}