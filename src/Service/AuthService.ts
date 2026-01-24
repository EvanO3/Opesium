import AuthUser from "../Models/AuthUser";
import supabase from "../Config/db"
import {AuthenticationError} from "../Exceptions/AuthenticationError"
import { ValidationError } from "../Exceptions/ValidationError";
import { DatabaseError } from "../Exceptions/DatabaseError";

/*Async function that will create the user
i.e Sign Up */

async function CreateUser( {name, email, password}: AuthUser): Promise<string> {
     if(!email || !password || !name){
        throw new ValidationError("Field is either missing or blank");
     }

     /**if the email is present reject the sign up request */
     const {data, error} = await supabase.from("Users").select(email);
     if(error){
                throw new DatabaseError("User with this email already Exists");
     }

     // Attempt to sign in user

     try{
         const {data, error} = await supabase.auth.signUp({
            email: email,
            password:password
         });
    
         if(error){
             console.error(error)
             throw new DatabaseError("Error has occurred trying to sign up user: " + error.message)
         }

         /*If code gets to this point, it means the signup was successful so add user to table */
         const userId: string | undefined = data?.user?.id


           // if the auth userId is found then insert the record into
         if(userId !== undefined){
         const  {error:dbError} = await supabase.from("Users").insert({name: name, email:email, auth_Id: userId })
         if(dbError){
            console.error("Db Error has occurred " + dbError)
      
             throw new DatabaseError("Database Error has occurred failed to sign up user: " + dbError.message)
         }

         }else{
                throw new DatabaseError("Failed to retrieve userId from auth user")
         }
         /*return something more valuable */ 
         return "Created User successfully"

     }catch(error){
        console.error("Failed to create the user unexpected error: " + error)
        throw error;
        
     }

     


}



/**Login
 * Note: User must be verified before login
 */
async function login({email, password}: AuthUser):Promise<string>{
 if(!email || !password ){
        throw new ValidationError("Failed to retrieve user email or password");
     }
    
     const {data, error} = await supabase.auth.signInWithPassword({email:email, password:password});
     if(error){
        console.log("Error has occurred on login " + error.message)
       
        throw new DatabaseError("An error has occured during the login: " + error.message)
     }

     const accessToken: string = data?.session.access_token;
     return accessToken;





}


async function SignOut(): Promise<String>{
 
    const {error} = await supabase.auth.signOut();
    if(error){
        throw new DatabaseError("Error has occurred signing out the user")
    }
    return "Sign out Successful"
}
export {CreateUser, login, SignOut}