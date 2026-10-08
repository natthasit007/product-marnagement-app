import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import productRouter from "./router/productRouter.js";

dotenv.config();
const PORT = process.env.BACKEND_PORT;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    return res
      .status(200)
      .send("<h>welcome to Restful API for Product Mangement App</h>");
});
app.use("/api/products", productRouter);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON request body" });
  }

  console.error(error);
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : error.message;
  return res.status(500).json({ message });
});

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
  });
};

startServer();