import request from "supertest";
import { app } from "../../app";

it("returns a 404 if the ticket is not found", async () => {
  await request(app).get("/api/tickets/testId1213").send().expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const title = "concert";
  const price = 20;
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(201);
  const ticket = response.body;
  const ticketResponse = await request(app)
    .post(`/api/tickets/${ticket.id}`)
    .send()
    .expect(200);
  const newTicket = ticketResponse.body;
  expect(newTicket.title).toEqual(ticket.title);
  return expect(newTicket.price).toEqual(ticket.price);
});
