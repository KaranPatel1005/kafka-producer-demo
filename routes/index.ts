import { TOPICS } from "../kafka/kafka";
import { sendMessage } from "../kafka/setup";
import express, { NextFunction, Request, Response } from "express";
const router = express.Router();

/* GET home page. */
router.get("/send", function (req: Request, res: Response, next: NextFunction) {
  sendMessage(TOPICS.topic1, JSON.stringify({ message: "hi" }));
  res.status(200).json({
    status: true,
  });
});

export default router;
