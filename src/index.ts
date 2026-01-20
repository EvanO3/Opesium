import express, {Application, Request, Response} from "express"

const app: Application = express();

const PORT :number = 3000

app.get("/", (req: Request, res: Response)=>{
    res.json({message:"Typescript node is working"})
});




app.listen(PORT, ()=>{
    console.log(`Listening to app on port ${PORT}`)
});