import express from "express"
import {UserCreation} from "../Controller/AuthController"
const router = express.Router();



router.post("/signup", UserCreation)



export default {router}