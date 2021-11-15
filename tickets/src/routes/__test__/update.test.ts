import request from "supertest";
import { app } from "../../app";

it("returns a 404 if the provided id does not exist", async () => {
  const id = global.newMongooseId();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({ title: "testTitle", price: 20 })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = global.newMongooseId();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "testTitle", price: 20 })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {});

// it("returns a 400 if the user provides an invalid title/price");

// it("updates the ticket if valid credentials are given");
//
