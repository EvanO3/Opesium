import express from "express";
import dotenv from "dotenv";
dotenv.config();
const PORT = parseInt(process.env.PORT_NUMBER || "3000", 10);
const app = express();
app.post("/signup", (req, res) => {
    res.send("Sign up route");
});
app.post("/login", (req, res) => {
    res.send("Sign in route");
});
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
