import express, { Request, Response } from "express";
import { Ticket } from "../models/Ticket";
import { body } from "express-validator";

import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
} from "@devstoic-learning/ticketing";

const router = express.Router();
router.put(
  "/api/tickets/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id).lean().exec();

    if (!ticket) {
      throw new NotFoundError();
    }
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
