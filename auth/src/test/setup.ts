import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  return mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  mongo.stop();
  mongoose.connection.close();
  // not awaiting both above as it leads to jest timing out
});
