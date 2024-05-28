import { sendMessage } from "../kafka/setup";
import express, { NextFunction, Request, Response } from "express";
const router = express.Router();

/* GET home page. */
router.get("/send", function (req: Request, res: Response, next: NextFunction) {
  sendMessage;
  res.render("index", { title: "Express" });
});

export default router;
