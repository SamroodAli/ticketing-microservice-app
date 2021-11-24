import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@devstoic-learning/ticketing";
import { Ticket } from "../models/Ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

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

    // here there are some possible issues
    //issue1:
    // Saving the ticket to the database but failing to publish the event, maybe nats was down.
    // solution => have another db to track events and another process/business logic to publish events from the db to nats
    // This way, our events are stored and we can have logic to make sure all the events in event db are published
    //issue2: Failing to save to one of the databases
    // solution: We have to rollback the other database save
    //by having these two database mutations(saving to ticket collection and events db) as a single mongodb transaction.
    // Ofcourse maybe we have to save these two again.

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });
    return res.status(201).json(ticket);
  }
);

export { router as createTicketRouter };
