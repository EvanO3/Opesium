import { createClient } from "@supabase/supabase-js";

import dotenv from "dotenv";
dotenv.config();


const supabaseUrl :string| undefined   = process.env.SUPABASE_URL;
const supabaseKey :string |undefined   = process.env.SUPABASE_KEY;

if(!supabaseUrl || !supabaseKey){
throw new Error("Failed to retrieve DB credentials");
}


 const supabase = createClient(supabaseUrl, supabaseKey);
 export default supabase
    






