import express from "express";
import { json, urlencoded } from "body-parser";

import { currentUserRouter } from "./routes/current-user";

const app = express();
app.use(json());

app.use(urlencoded({ extended: true }));

app.use(currentUserRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
