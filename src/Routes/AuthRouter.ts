import express from "express"
import {UserCreation, LoginUser, SignOutUser, verifiedRoute} from "../Controller/AuthController"
import { Request, Response} from "express"

const router = express.Router();



router.post("/signup", UserCreation)
router.post("/login", LoginUser)
router.post("/signout", SignOutUser)
router.get("/auth", verifiedRoute, (req: Request, res: Response)=>{
    res.status(200).json({message: "Welcome"})
});


export default {router}