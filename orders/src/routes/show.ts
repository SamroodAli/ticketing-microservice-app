import express, { Request, Response } from "express";
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
} from "@devstoic-learning/ticketing";
import mongoose from "mongoose";
import { Order } from "../models/Order";

const router = express.Router();
router.get(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const orderId = req.params.orderId;
    if (mongoose.Types.ObjectId.isValid(orderId)) {
      const order = await Order.findById(orderId)
        .populate("ticket")
        .lean()
        .exec();
      if (!order) {
        throw new NotFoundError();
      }
      if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
      }
      res.status(200).send(order);
    } else {
      throw new BadRequestError();
    }
  }
);

export { router as showOrderRouter };
