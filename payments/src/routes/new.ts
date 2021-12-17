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
import { stripe } from "../stripe";

import { Order } from "../models/Order";
import { Payment } from "../models/Payment";
import { Stripe } from "stripe";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

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
    } catch (err) {
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

    try {
      const charge = await stripe.charges.create({
        currency: "usd",
        amount: order.price * 100, // order.price is in dollars and we need cents for stripe
        source: token,
        description: `Ticketing.org - order ticket - orderId: ${orderId}`, //optional
      });

      const payment = Payment.build({
        orderId,
        stripeId: charge.id,
      });

      await payment.save();
      await new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId,
        stripeId: charge.id,
      });
    } catch (err: Stripe.Errors | any) {
      throw new BadRequestError(err.message);
    }

    res.status(201).send({ success: true });
  }
);

export { router as createChargeRouter };
