import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError

} from "@devstoic-learning/ticketing";
import { body } from "express-validator";
import { Ticket } from "../models/Ticket";
import { Order,OrderStatus } from "../models/Order";

const router = express.Router();
router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => {
        mongoose.Types.ObjectId.isValid(input);
      })
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

    const isReserved = await ticket.isReserved()

    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved')
    }
    // Calculate an expiration date for this order
    // Build the order and save it to the database
  }
);

export { router as createOrderRouter };
