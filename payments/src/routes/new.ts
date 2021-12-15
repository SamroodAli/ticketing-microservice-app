import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from "@devstoic-learning/ticketing";
import { CastError } from "mongoose";

import { Order } from "../models/Order";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    let order;
    try {
      // as orderId might not be a valid id which throws an error
      order = await Order.findById(orderId);
    } catch (err: CastError | any) {
      throw new BadRequestError("Please provide a valid Order id");
    }

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for an cancelled order");
    }

    res.send({ success: true });
  }
);

export { router as createChargeRouter };
