import express from "express";
import { json, urlencoded } from "body-parser";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/singout";
import { signupRouter } from "./routes/signup";

import { errorHandler } from "./middlewares/error-handler";

const app = express();
app.use(json());

app.use(urlencoded({ extended: true }));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
