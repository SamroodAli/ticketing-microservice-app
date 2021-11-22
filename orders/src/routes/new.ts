import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
} from "@devstoic-learning/ticketing";
import { body } from "express-validator";
import { Ticket } from "../models/Ticket";
import { Order, OrderStatus } from "../models/Order";
import { natsWrapper } from "../nats-wrapper";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";

// The window a user has to pay for his ordered ticket before the order expires.
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

const router = express.Router();
router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Please provide a valid ticket Id"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // res.send({});
    // Find the ticket that the user is trying to order in the database
    const { ticketId } = req.body;
    // Make sure that this ticket is not already reserved
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }
    // Calculate an expiration date for this order
    const expiration = new Date();

    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
    // Build the order and save it to the database

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket,
    });

    await order.save();

    new OrderCreatedPublisher(natsWrapper.client).publish({
      status: OrderStatus.Created,
      userId: req.currentUser!.id,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
      expiresAt: order.expiresAt.toISOString(),
      //very important, this event will be stringified when publishing and we cannot rely on the default behavior of Data stringificaiton
      //which consider's the user's current timezone, instead we want an general timezone, here it will be utc
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
