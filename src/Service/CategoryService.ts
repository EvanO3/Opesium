import supabase from "../Config/db"
import{DatabaseError} from "../Exceptions/DatabaseError.ts"
/**Getting all the categories in the db */


async function getAllCategories(){

    const {data, error} = await supabase.from("Category").select('*');

    if(error){
        throw new DatabaseError("Failed to retrieve Categories from DB")
    }
    return data

}

export default getAllCategories