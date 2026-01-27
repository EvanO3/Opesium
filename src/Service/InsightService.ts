import {weeklyTransactionsRetrieval} from "../Service/TransactionService"
import { AuthenticationError } from "../Exceptions/AuthenticationError"
import { DatabaseError } from "../Exceptions/DatabaseError"
import { weeklyInsightPrompt } from "../Config/prompts"
import { GoogleGenAI } from "@google/genai"
import supabase from "../Config/db"
import dotenv from "dotenv";
dotenv.config()
 async function createInsight(jwt:string){
 const {data:{user}} = await supabase.auth.getUser(jwt);

 const userAuthId=user?.id;

 if(!userAuthId){
    throw new AuthenticationError("Failed to find the user")
 }
 const {data:userIdData,error:userIdError} = await supabase.from("Users").select("id").eq("auth_Id", userAuthId).single();

 if(userIdError){
    console.log(userIdError.message)
    throw new DatabaseError("Database operation failed to find user")
 }

 const userId = userIdData?.id;
 const weeklyData = await weeklyTransactionsRetrieval(jwt);
 const weeklyDataString = JSON.stringify(weeklyData, null,2)
 const prompt = weeklyInsightPrompt(weeklyDataString);

 /**Generating insights */

 const model = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})
 const response = await model.models.generateContent({
    model:"gemini-3-flash-preview",
    contents:prompt
 })


 /**Now to save the response in the db then return the cleaned response to the user */

 const {data:financialData, error:financialDataError} = await supabase.from("Insights").insert({
    user_id:userId,
    summary:response?.text,
    period:'weekly',
    generated_at:new Date().toDateString(),



 })
 .select();

if(financialDataError){
    throw new DatabaseError("Failed to insert finacial insights into Database")
}

return financialData;
 

}




 export default createInsight