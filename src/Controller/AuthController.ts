import { CreateUser } from "../Service/AuthService";
import {Request, Response} from "express"


const UserCreation = async (req: Request, res:Response) =>{
    try{
    const {email, password} = req.body;
    console.log(`This is the users Email : ${email}, and password ${password}`)
    await CreateUser({email, password});
    return  res.status(200).json({message:"User creation successful"})

    }catch(error){
     return  res.status(500).json({message:"Internal Server Error :" ,error} )
        
    }
} 




export {UserCreation}
