import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI JWT_KEY must be defined");
  }

  try {
    // cluster id comes from infra/nats-deployment=> arguments(args)=> cid (clusterid)
    await natsWrapper.connect(
      "ticketing",
      "ticket-client",
      "http://nats-srv:4222"
    );
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Tickets service MongoDb");
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log("Tickets server is running on port 3000");
  });
};

start();
