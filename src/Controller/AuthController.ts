import { CreateUser, login, SignOut } from "../Service/AuthService";
import verifyProjectJwt from "../Middleware/Jwt"
import {NextFunction, Request, Response} from "express"

/**Helper function for catch block */

function getErrorMessage(error : unknown): string{
    if (error instanceof Error){
        return error.message
    }

    if(typeof error === 'string'){
        return error
    }

    /*fall back if none of the match's checkout*/

    return "An unexpected Error occured"
}   





/**Refactor to throw meaningful error codes not only 201 and 500 */

const UserCreation = async (req: Request, res:Response) =>{
    try{
    const {name, email, password} = req.body;
    const userInfo = await CreateUser({name, email, password});
    return res.status(201).json({message:userInfo});

    }catch(error){
    console.log("This is the error point ", error);
    const errorMessage = getErrorMessage(error);
     return  res.status(400).json({error:"Error occured: " + errorMessage} )
        
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
        console.log("An unexpected Error has occured " + error)
        const errorMessage = getErrorMessage(error);
        return res.status(401).json({error:"Incorrect Email or Password:  " , errorMessage})
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
        const errorMessage = getErrorMessage(error);
        return res.status(400).json({message: "Failed to sign out user: " + errorMessage})
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
