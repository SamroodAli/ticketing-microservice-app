import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

let mongo: MongoMemoryServer;

declare global {
  var signin: () => string[];
  var newMongooseId: () => string;
}

jest.mock("../nats-wrapper.ts");

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
  await mongo.stop();
  await mongoose.connection.close();
  // dont await to avoid jest timing out
});

global.newMongooseId = () => new mongoose.Types.ObjectId().toHexString();

global.signin = () => {
  // build a jwt payload {id,email}
  const payload = {
    id: global.newMongooseId(),
    email: "test@test.com",
  };

  // create a jwt token
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // build session object { jwt : my_jwt }
  const session = { jwt: token };
  // turn that session into JSON as express sends it as JSON
  const sessionJSON = JSON.stringify(session);
  // take JSON and encode it as base64 as  cookieSession packages encodes it in base64
  const base64 = Buffer.from(sessionJSON).toString("base64");
  // return a string thats the cookie with the encoded data
  //supertest expects cookies in an array
  return [`express:sess=${base64}`];
};
