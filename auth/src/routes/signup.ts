import express from "express";

const router = express.Router();

router.post("/api/users/signup", (req, res) => {
  res.send("hey sign up");
});

export { router as signupRouter };
