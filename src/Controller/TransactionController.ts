import {addTransaction, getAllTransactions,updateTransaction, deleteTransaction, weeklyTransactionsRetrieval} from "../Service/TransactionService";
import express from "express";
import type { Request, Response } from "express";
import  getErrorMessage from "../Config/ErrorMessage";
import { ValidationError } from "../Exceptions/ValidationError";
import { DatabaseError } from "../Exceptions/DatabaseError";
import { AuthenticationError } from "../Exceptions/AuthenticationError";
import { UnathorizationError } from "../Exceptions/UnauthorizationError";
import { ResourceNotFound } from "../Exceptions/ResourceNotFound";
/**Fix controller since service does not throw error it gives 200
 * even if an error occurs
 */
export const CreateTransaction = async (req: Request, res: Response) => {
  try {
    const { categoryName, amount, description,paymentMethod,paymentType,storeName } = req.body;
    const userJwt:string|undefined = req.headers['authorization']?.replace("Bearer ", "")
       if(!userJwt){
            return res.status(401).json({message:"Unauthorized"});
        }

    await addTransaction({categoryName, amount, description, paymentMethod,paymentType,storeName}, userJwt);
    
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



export const RetrieveUsersTransactions = async(req: Request, res: Response) =>{
    try{

      const userJwt:string|undefined = req.headers['authorization']?.replace("Bearer ", "");
       if(!userJwt){
            return res.status(401).json({message:"Unauthorized"});
        }

      const transactionData = await getAllTransactions(userJwt);
      return res.status(200).json({data:transactionData});
    }catch(error){
        if(error instanceof DatabaseError){
          return res.status(500).json({error: error.message});
        }
        else {
          res.status(500).json({error: "Internal Server Error"});
        }
    }

}


export const updateUserTransction = async (req: Request, res:Response)=>{
  

  try{
 const userJwt:string|undefined = req.headers['authorization']?.replace("Bearer ", "");
       if(!userJwt){
            return res.status(401).json({message:"Unauthorized"});
          }

         const {categoryId, amount, description} = req.body;
         const{transactionId}= req.params;

         const stringTransactionId = transactionId?.toString();

         if(stringTransactionId===undefined){
           return res.status(400).json({message:"failed to parse transaction id from query param"})
         }
         await updateTransaction(userJwt, stringTransactionId, categoryId, amount, description)
 
          return res.status(204).json({message:"update successful"})

  }catch(error){
    if(error instanceof UnathorizationError){
      return res.status(403).json({error: error.message})
    }
    else if(error instanceof ResourceNotFound){
      return res.status(404).json({error: error.message})
    }else if(error instanceof ValidationError){
      return res.status(400).json({error:error.message})
    }
    else{
      return res.status(500).json({error: "Internal Server Error"})

    }
  }



}


export const deleteUsersTransaction = async (req: Request, res:Response)=>{
  try{
    const userJwt:string|undefined = req.headers['authorization']?.replace("Bearer ", "");
     if(!userJwt){
            return res.status(401).json({message:"Unauthorized"});
          }

         const{transactionId}= req.params;

         const stringTransactionId = transactionId?.toString();

         if(stringTransactionId===undefined){
           return res.status(400).json({message:"failed to parse transaction id from query param"})
         }
         await deleteTransaction(userJwt, stringTransactionId);
 
        return res.status(204).json({})

  }catch(error){
    if(error instanceof DatabaseError){
      return res.status(500).json({error: error.message})
    }else if(error instanceof ValidationError){
      return res.status(400).json({error:error.message})
    }else if(error instanceof ResourceNotFound){
      return res.status(403).json({error: error.message})
    }
    else{
      return res.status(500).json({error: "Internal Server Error"})
    }
  }
}

export const weeklyTransactions = async (req: Request, res:Response)=>{
  try{
    const userJwt:string|undefined = req.headers['authorization']?.replace("Bearer ", "");

     if(!userJwt){
            return res.status(401).json({message:"Unauthorized"});
          }


        
         const data = await weeklyTransactionsRetrieval(userJwt)
 
        return res.status(200).json({data})

  }catch(error){
    if(error instanceof DatabaseError){
      return res.status(500).json({error: error.message})
    }else if(error instanceof ValidationError){
      return res.status(400).json({error:error.message})
    }else if(error instanceof ResourceNotFound){
      return res.status(403).json({error: error.message})
    }
    else{
      return res.status(500).json({error: "Internal Server Error"})
    }
  }
}
