 import {Request, Response } from "express"
 import createInsight from "../Service/InsightService"
 import {AuthenticationError} from "../Exceptions/AuthenticationError"
 import { DatabaseError } from "../Exceptions/DatabaseError"

 
 export const generateInsights = async (req: Request, res: Response) => {

    try{
        const userJwt:string|undefined = req.headers['authorization']?.replace("Bearer ", "")
       if(!userJwt){
            return res.status(401).json({message:"Unauthorized"});
        }

        const userInsights = await createInsight(userJwt);

        return res.status(200).json({userInsights})

        

    }catch(error){
        if(error instanceof AuthenticationError){
            return res.status(403).json({error: error.message})
        }

        else if(error instanceof DatabaseError){
            return res.status(500).json({error: error.message})
        }
        else{
            res.status(500).json({error: "Internal Server Error"})
        }
    }



 }