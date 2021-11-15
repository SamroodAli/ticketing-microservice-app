import express from "express";

const router = express.Router();

router.post("/api/tickets", (req, res) => {
  res.sendStatus(200);
});

export { router as createTicketRouter };
