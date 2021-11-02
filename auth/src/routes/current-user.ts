import express from "express";

const router = express.Router();

router.get("/api/users/currentuser", (req, res) => {
  res.send("hey bro");
});

export { router as currentUserRouter };
