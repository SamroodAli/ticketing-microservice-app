import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns a 404 if the ticket is not found", () => {
  const newObjectId = global.newMongooseId();
  return request(app).get(`/api/tickets/${newObjectId}`).send().expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const title = "concert";
  const price = 20;
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .send({
      title,
      price,
    })
    .expect(201);
  const ticketResponse = await request(app).get(
    `/api/tickets/${response.body.id}`
  );
  expect(ticketResponse.body.title).toEqual(title);
  return expect(ticketResponse.body.price).toEqual(String(price));
});
