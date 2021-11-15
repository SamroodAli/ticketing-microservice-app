import express, { Request, Response } from "express";
import { Ticket } from "../models/Ticket";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  const tickets = await Ticket.find({}).lean().exec();
  res.status(200).json(tickets);
});

export { router as indexTicketRouter };
