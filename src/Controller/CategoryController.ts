import { DatabaseError } from "../Exceptions/DatabaseError"
import {Request, Response} from "express"
import getAllCategories from "../Service/CategoryService"
export const getCategories = async (req: Request, res: Response )=>{

try{

    const data = await getAllCategories()
    res.status(200).json({data: data})

}catch(error){
    if(error instanceof DatabaseError){
             return res.status(500).json({error:error.message});
 }
 else{
      return res.status(500).json({error:"Internal Server Error"});
 }
}
}