import addTransaction from "../Service/TransactionService";
import express from "express";
import type { Request, Response } from "express";
import  getErrorMessage from "../Config/ErrorMessage";
import { ValidationError } from "../Exceptions/ValidationError";
import { DatabaseError } from "../Exceptions/DatabaseError";
import { AuthenticationError } from "../Exceptions/AuthenticationError";
/**Fix controller since service does not throw error it gives 200
 * even if an error occurs
 */
export const CreateTransaction = async (req: Request, res: Response) => {
  try {
    const { categoryName, amount, description } = req.body;
    const userJwt:string|undefined = req.headers['authorization']?.replace("Bearer ", "")
       if(!userJwt){
            return res.status(401).json({message:"Unauthorized"});
        }

    await addTransaction({categoryName, amount, description}, userJwt);
    
    return res.status(201).json({ message: "successful transaction" });
  } catch (error) {
    // const errorMessage = getErrorMessage(error)

    if(error instanceof ValidationError){
      return res.status(400).json({ Error:error.message });
    } if(error instanceof AuthenticationError){
       return res.status(401).json({ Error:error.message});
    }else if(error instanceof DatabaseError){
      return res.status(500).json({ Error:error.message});

    }else{
      console.error("Unknown Error has occured: ", error)
      return res.status(500).json({ Error:"Internal Server Error"});
    }

    

  }
};
