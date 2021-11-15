import express, { Request, Response } from "express";
import { NotFoundError } from "@devstoic-learning/ticketing";

import { Ticket } from "../models/Ticket";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id).lean().exec();
  if (!ticket) {
    throw new NotFoundError();
  }
  return res.status(200).json(ticket);
});

export { router as showTicketRouter };
