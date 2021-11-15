import express from "express";
import "express-async-errors";
import { json, urlencoded } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@devstoic-learning/ticketing";
import { createTicketRouter } from "./routes/new";

const app = express();
app.set("trust proxy", true); // traffic is proxied from ingress-nginx

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test", //true unless running tests
  })
);
app.use(urlencoded({ extended: true }));
app.use(createTicketRouter);
app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
