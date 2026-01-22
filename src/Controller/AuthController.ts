import { CreateUser, login, SignOut } from "../Service/AuthService";
import verifyProjectJwt from "../Middleware/Jwt"
import {NextFunction, Request, Response} from "express"
import { STATUS_CODES } from "http";


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

/**May need more logic
 * TODO:
 */

const SignOutUser = async (req: Request, res: Response)=>{
    try{
        const signOutMessage = await SignOut();
        return res.status(200).json({message:signOutMessage})

    }catch(error){
        return res.status(400).json({message: "Failed to sign out user: " + error})
    }
}


const verifiedRoute = async (req:Request, res:Response, next:NextFunction)=>{
    try{
        const userJwt:string|undefined = req.headers['authorization']?.replace("Bearer ", "")
        if(!userJwt){
            return res.status(401).json({message:"Unauthorized"});
        }
         await verifyProjectJwt(userJwt);
         next();

    }catch(error){
           console.log("Error Verifying Jwt: ", error)
           return res.status(401).json({message:"Unauthorized"});

    }

  

    

}







export {UserCreation, LoginUser, SignOutUser, verifiedRoute}
