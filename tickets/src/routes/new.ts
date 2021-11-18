import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@devstoic-learning/ticketing";
import { Ticket } from "../models/Ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
// import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be provided and must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id, //exclamation mark as we are sure there is currentUser by using requireAuth
      // if not currentUser,requireAuth will throw an error and will not reach this line.
    });

    await ticket.save();

    // new TicketCreatedPublisher(natsWrapper).publish({
    //   id: ticket.id,
    //   title: ticket.title,
    //   price: ticket.price,
    //   userId: ticket.userId,
    // });
    return res.status(201).json(ticket);
  }
);

export { router as createTicketRouter };
