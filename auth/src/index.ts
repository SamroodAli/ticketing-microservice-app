import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI JWT_KEY must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Auth service MongoDb");
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log("Auth Server is running on port 3000");
  });
};

start();
