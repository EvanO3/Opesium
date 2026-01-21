import express, {Application, Request, Response} from "express"
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import AuthRouter from "./Routes/AuthRouter"
dotenv.config();

const supabaseUrl :string | undefined = process.env.SUPABASE_URL;
const supabaseKey : string | undefined  = process.env.SUPABASE_KEY;




const app: Application = express();
/** Store port number in process .env don't explicitly have it out */
const PORT : number  = parseInt(process.env.PORT_NUMBER || "3000", 10)

app.use(express.json())

app.get("/", (req: Request, res: Response)=>{
    res.json({message:"Typescript node is working"})
});

app.use("/api/v1", AuthRouter.router)

/*Function to test DB connection */


/**Note used this in the supabase sql console
 * 
 * 
 * CREATE OR REPLACE FUNCTION hello_world()
RETURNS TEXT AS $$
BEGIN
  RETURN 'Connection successful';
END;
$$ LANGUAGE plpgsql;

which allowed me to call the rpc function called hello_world
 */
 async function testDBConnection() : Promise<boolean> { 

    try{

            if(supabaseUrl !==undefined && supabaseKey !== undefined){
             const supabase = createClient(supabaseUrl, supabaseKey);
            const {data,  error} = await supabase.rpc("hello_world");
       
    
            if(error){
                console.log("Error connecting to the database: ", error);
                return false; //connection failed in this case
            }else if(data){
                console.log("Connected to the DB")
                return true; // if data is returned the connection is successful
            }else{
                console.log("Something happened failed to connected ", data);
                
                return false;
            }       
}else{
    return false // this case is incase either the url or key is undefined
}
    }catch(error){
        console.error("Something happened cause database connection to fail ", error);
        throw error;
    }


 }





app.listen(PORT, ()=>{
    console.log(`Listening to app on port ${PORT}`)
    testDBConnection();
});