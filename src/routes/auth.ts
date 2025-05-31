import * as express from "express";
import { loginUser, registerUser } from "../controller/auth";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", (req, res, next) => {
  loginUser(req, res).catch(next);
});

export default router;
