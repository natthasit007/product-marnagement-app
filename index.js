import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv .config();
const PORS = process.env.BACKEND_PORT;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/",(req, res) => {
    return
    res.status(200)
    .send("<h>welcom to estful API for Product Management</h>")
});

app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
});
