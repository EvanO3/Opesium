import AuthUser from "../Models/AuthUser";
import supabase from "../DbConfig/db"


/*Async function that will create the user */

async function CreateUser( {email, password}: AuthUser): Promise<string> {
     if(email && password){
        throw new Error("Failed to retrieve user email and pass");
     }

     try{
         const {data, error} = await supabase.auth.signUp({
            email: email,
            password:password
         });
    
         if(error){
            throw new Error("Error has occurred: " + error.message)
         }
    
         return "Succesfully Signed Up User"

     }catch(error){
        throw new Error("Internal Server Error" + error)
     }

     


}

export {CreateUser}