import express from "express";
import "express-async-errors";
import { json, urlencoded } from "body-parser";
import morgan from "morgan";
import cookieSession from "cookie-session";
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@devstoic-learning/ticketing";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes/index";
import { updateTicketRouter } from "./routes/update";

const app = express();
app.set("trust proxy", true); // traffic is proxied from ingress-nginx
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(morgan("dev"));

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test", //true unless running tests
  })
);

app.use(currentUser);
app.use(showTicketRouter);
app.use(updateTicketRouter);
app.use(createTicketRouter);
app.use(indexTicketRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
