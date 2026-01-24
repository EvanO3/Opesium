import { CreateUser, login, SignOut } from "../Service/AuthService";
import verifyProjectJwt from "../Middleware/Jwt"
import {NextFunction, Request, Response} from "express"
import  getErrorMessage from "../Config/ErrorMessage";
import {AuthenticationError} from "../Exceptions/AuthenticationError"
import { ValidationError } from "../Exceptions/ValidationError";
import { DatabaseError } from "../Exceptions/DatabaseError";
/**Helper function for catch block */




/**Refactor to throw meaningful error codes not only 201 and 500 */

const UserCreation = async (req: Request, res:Response) =>{
    try{
    const {name, email, password} = req.body;
    const userInfo = await CreateUser({name, email, password});
    return res.status(201).json({message:userInfo});

    }catch(error){
        if(error instanceof ValidationError){
            return res.status(400).json({error: error.message})
        }
        else if(error instanceof DatabaseError){
            return res.status(500).json({error: error.message})

        }

     return  res.status(400).json({error:"Error Internal Server Error: "} )
        
    }
} 


/*TODO:
    Maybe add more logic for catch block to remove double error message*/
const LoginUser = async (req: Request, res: Response)=>{
    try{
        const {email, password}= req.body;
        const userToken:string = await login({email, password});

        return res.status(200).json({token:userToken})

    }catch(error){

        if(error instanceof DatabaseError){
              return res.status(500).json({error:error.message})
        }else if(error instanceof ValidationError){
             return res.status(400).json({error:error.message})

        }
        console.log("An unexpected Error has occured " + error)
 
        return res.status(500).json({error:"Internal Server error"})
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
        if(error instanceof DatabaseError){
            return res.status(500).json({message: error.message})
        }
        return res.status(500).json({message: "Failed to sign out user: "})
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

           const errorMessage = getErrorMessage(error);
           console.log("Error Verifying Jwt: ", errorMessage)
           return res.status(401).json({message:"Unauthorized"});

    }

  

    

}







export {UserCreation, LoginUser, SignOutUser, verifiedRoute}
