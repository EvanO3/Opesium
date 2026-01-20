import express from "express";
const app = express();
const PORT = 3000;
app.get("/", (req, res) => {
    res.json({ message: "Typescript node is working" });
});
app.listen(PORT, () => {
    console.log(`Listening to app on port ${PORT}`);
});
