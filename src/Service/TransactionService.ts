import supabase from "../Config/db.ts"
import {ValidationError} from "../Exceptions/ValidationError.ts"
import{DatabaseError} from "../Exceptions/DatabaseError.ts"
import { UnathorizationError } from "../Exceptions/UnauthorizationError.ts";
import { ResourceNotFound } from "../Exceptions/ResourceNotFound.ts";



 async function addTransaction({categoryName ,amount ,description, paymentMethod, paymentType, storeName} :Transaction,  jwt:string) {

    /**No need to check if the transaction is there as duplicate transaction should be allowed
     * Id is auto gen so it will never be the same
     */
 

    if(!categoryName || !amount || !description || !paymentMethod ||!paymentType ||!storeName){
        throw new ValidationError("Missing argument for transaction");
    }else if(amount < 0){
        throw new ValidationError("Amount must be greater than $0");
    }

    const amountNum = Number(amount);


    /**Now we can insert */

    /**Get userId */
    
    const {data:userIdentity, error: userIdentityError} = await supabase.auth.getUser(jwt);

    
    if(userIdentityError){
        throw new DatabaseError("Failed to retrieve UserId from JWT")
    }

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
        store_name:storeName,
        payment_type:paymentType,
        payment_method:paymentMethod,
        category_id: categoryId?.id,
        description:description,
        date:new Date().toLocaleString()
    });

    
    if(insertionError){
        console.error("Error inserting: " + insertionError.message);
        throw new DatabaseError("Failed adding transaction to db, please try again " + insertionError.details);

    }

    


    

    




 

}


/**Future todo, add pagination */


async function getAllTransactions(jwt: string) {
    const {data, error} = await supabase.auth.getUser(jwt);
    if(error){
        throw new DatabaseError("Failed to find authenticated user")
    }

    const authId = data?.user?.id;

    if(!authId){
        throw new DatabaseError("Failed to retrieve userId")
    }
    
    const {data:userData, error: userError} = await supabase.from("Users").select("id").eq("auth_Id" ,authId).single();
    if(userError){
       throw new DatabaseError("Failed to retrieve userId")
    }

    const userId = userData.id

    const {data: transactionData, error:transactionError} = await supabase.from("Transaction").select("*").eq("user_id", userId )

    if(transactionError){
        throw new DatabaseError("Failed to retrieve transaction data" + transactionError.message )
    }

    return transactionData;


}



/**Category Id must also be sent in payload to check if
 * it exists
*/

async function updateTransaction(jwt:string, transactionId:string, categoryId:string, amount:number, description:string){
    const {data, error} = await supabase.auth.getUser(jwt);

    if(!categoryId && !transactionId){
        throw new ValidationError("Missing Category or Transaction Id")
    }

    if(error){
        throw new DatabaseError("Failed to retrieve user from jwt")
    }

    /*Auth user id*/
    const authUserId = data?.user.id;
   
    const {data:userIdData, error:userIdError} = await supabase.from('Users').select('id').eq('auth_Id', authUserId).single();
   
    if(userIdError){
        throw new DatabaseError("Failed to retrieve userId");
        
    }



  
    const UserId = userIdData.id;

    const {data:categoryInfo, error:categoryError} = await supabase.from("Category").select('*').eq('id',categoryId);

    if(categoryError){
        console.log(categoryError.message)
        throw new ResourceNotFound("Category with Id is not found")
    }

    const{error:updateError} = await supabase.from('Transaction').update({category_id:categoryId, amount:amount, description:description}).match({id: transactionId, user_id: UserId})

    if(updateError){
        throw new UnathorizationError("Cannot edit this resource")
    }

    
}


/**TODO:
 * Case when trying to delete something that isn't there */

async function deleteTransaction(jwt:string, transactionId:string){

    if(!transactionId){
        throw new ValidationError("Failed to retrieve Transaction Id")
    }

    const {data:{user}} = await supabase.auth.getUser(jwt);

    

    /*Auth user id*/
    const authUserId = user?.id;
   
    const {data:userIdData, error:userIdError} = await supabase.from('Users').select('id').eq('auth_Id', authUserId).single();
   
    if(userIdError){
        throw new DatabaseError("Failed to retrieve userId");
        
    }



  
    const UserId = userIdData.id;

    console.log("here")
    const response = await supabase.from('Transaction').delete().match({id: transactionId, user_id: UserId})
    
    if(response.status !==204){
        throw new DatabaseError("Failed to delete Transaction:  ")
    } 
}


/**Refactor use supabase docs to do a Join between transaction table and Category table to retrieve:
 * Amount
 * Description
 * CategoryName
 */

async function weeklyTransactionsRetrieval(jwt :string){
    /*retrieve the user */

    const {data:{user}} = await supabase.auth.getUser(jwt);
    const userAuthId = user?.id


    console.log("Got here ")
    /*Server to compute dates instead of user query */
  const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString();
  const endDate = new Date().toLocaleDateString();



    //retrieve the user Id
    const {data:userData, error:userError} = await supabase.from("Users").select('id').eq('auth_Id', userAuthId).single()

    if(userError){
        throw new DatabaseError("Failed to retrieve user information")
    }
   const userId = userData?.id;

   const {data:transactionData, error:transactionError} = await supabase.from("Transaction").select(`store_name, payment_method,payment_type, amount,description,date, Category(name)`)
   .eq('user_id',userId)
   .gte('date', startDate)
   .lte('date', endDate);

   if(transactionError){
    throw new DatabaseError("Failed to retrieve transactions between : " +startDate + " and " +endDate)
   }
    
   const cleanedData = transactionData.map(transaction =>({
    store:transaction.store_name,
    paymentMethod:transaction.payment_method,
    paymentType:transaction.payment_type,
    amount:transaction.amount,
    description:transaction.description,
    date:transaction.date,
    category:transaction.Category?.name
   }))
return cleanedData;

}

export { addTransaction , getAllTransactions, updateTransaction, deleteTransaction, weeklyTransactionsRetrieval}
