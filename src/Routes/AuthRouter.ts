import express from "express"
import {UserCreation, LoginUser} from "../Controller/AuthController"
const router = express.Router();



router.post("/signup", UserCreation)
router.post("/login", LoginUser)



export default {router}