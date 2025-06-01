import express from "express";
import * as dotenv from "dotenv";
import { authenticateToken } from "./middleware/auth";
import authRouter from "./routes/auth";
import fileRouter from "./routes/file";

dotenv.config({
  path: "./.env",
});

// Initializing express app
const app = express();
app.use(express.json());

app.use("/auth", authRouter);

app.use(authenticateToken as express.RequestHandler);
// routes below this as authenticated via the middleware
app.use("/file", fileRouter);

app.listen(8000, () => console.log("Server running on http://localhost:8000"));
