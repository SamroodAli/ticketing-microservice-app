import request from "supertest";
import { app } from "../../app";

const createTicket = () => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "title", price: 20 });
};

it("can feetch a list of tickets", async () => {
  const tickets = [createTicket(), createTicket(), createTicket()];
  await Promise.all(tickets);

  const response = await request(app).get("/api/tickets").send().expect(200);
  expect(response.body.length).toEqual(3);
});
