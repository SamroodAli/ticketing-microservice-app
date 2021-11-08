import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  req.session = null;
  res.send({ message: "Cookie cleared" });
});

export { router as signoutRouter };
