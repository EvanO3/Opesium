import { CreateUser, login } from "../Service/AuthService";
import {Request, Response} from "express"


/**Refactor to throw meaningful error codes not only 201 and 500 */

const UserCreation = async (req: Request, res:Response) =>{
    try{
    const {name, email, password} = req.body;
    const userInfo = await CreateUser({name, email, password});
    return res.status(201).json({message:userInfo})

    }catch(error){
    console.log("This is the error point ", error)
     return  res.status(500).json({message:"Internal Server Error :" , error} )
        
    }
} 


const LoginUser = async (req: Request, res: Response)=>{
    try{
        const {email, password}= req.body;
        const userToken:string = await login({email, password});
     

        return res.status(200).json({token:userToken})

    }catch(error){
        console.log("An unexpected Error has occured " + error)
        return res.status(500).json({message:"An unexpected Error has occured: " , error})
    }
}








export {UserCreation, LoginUser}
