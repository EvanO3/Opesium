import supabase from "../Config/db.ts"
import {ValidationError} from "../Exceptions/ValidationError.ts"
import{DatabaseError} from "../Exceptions/DatabaseError.ts"



//TODO:
/**TODO:
 * 
 * READ
 * UPDATE
 * DELETE
 * 
 * 
 */
 async function addTransaction({categoryName ,amount ,description} :Transaction,  jwt:string) {

    /**No need to check if the transaction is there as duplicate transaction should be allowed
     * Id is auto gen so it will never be the same
     */
 

    if(!categoryName || !amount || !description ){
        throw new ValidationError("Missing argument for transaction");
    }else if(amount < 0){
        throw new ValidationError("Amount must be greater than $0");
    }

    const amountNum = Number(amount);


    /**Now we can insert */

    /**Get userId */
    
    const {data:userIdentity, error: userIdentityError} = await supabase.auth.getUser(jwt);


    /**Now that the userId is here we can make  */
    const authId = userIdentity.user?.id
    

    const {data: userIdData, error: userIdError} = await supabase.from("Users").select("id").eq("auth_Id", authId).single();

    
    if(userIdError){
        /*fix*/
        console.error("User Error: " + userIdError.message);
        throw new DatabaseError("Failed to retrieve user credentials " + userIdError.message);

    }

    /**Insertion of transaction 
     * 
     * 
     * - Now find the category_Id and then attach it 
     * 
     * before insert we must find the category the user wants to add
    */

    const {data: categoryId, error: categoryIdError} = await supabase.from("Category").select("id").eq("name", categoryName).single();


    if(categoryIdError){
        throw new DatabaseError("Failed to retrieve the specified category Id");
    }


    const {error:insertionError} = await supabase.from("Transaction").insert({
        user_id:userIdData?.id,
        amount:amountNum,
        category_id: categoryId?.id,
        description:"This was because there was no food",
        date:new Date()
    });

    if(insertionError){
        console.error("Error inserting: " + insertionError.message);
        throw new DatabaseError("Failed adding transaction to db, please try again " + insertionError.details);

    }

    


    

    




 

}


// async function getAllTransactions(jwt: string) {
//     const {data, error} = supabase.auth.getUser(jwt);
//     if(error){
//         throw new DatabaseError("Failed to find authenticated user")
//     }
// }




export default addTransaction
