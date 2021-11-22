import express, { Request, Response } from "express";
import { requireAuth } from "@devstoic-learning/ticketing";
import { Order } from "../models/Order";

const router = express.Router();
router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.currentUser!.id })
    .populate("ticket")
    .lean()
    .exec();
  res.status(200).send(orders);
});

export { router as indexOrderRouter };
