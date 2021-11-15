import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/Ticket";

it("has a route handler listening to /api/tickets for a post request", async () => {
  const response = await request(app).post("/api/tickets").send({});

  return expect(response.status).not.toEqual(404);
});

it("can only be accesed if the user is signed in", async () => {
  return request(app).post("/api/tickets").send({}).expect(401);
});

it("returns a status other than 401 if user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({});
  return expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  const withEmptyTitle = request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      ticket: "",
      price: 10,
    })
    .expect(400);
  const withoutEmptyTitle = request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      price: 10,
    })
    .expect(400);

  return Promise.all([withEmptyTitle, withoutEmptyTitle]);
});

it("returns an error if an invalid price is provided", async () => {
  const withEmptyPrice = request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      ticket: "validTitle",
      price: -10,
    })
    .expect(400);
  const withoutEmptyPrice = request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "validTitle",
    })
    .expect(400);

  return Promise.all([withEmptyPrice, withoutEmptyPrice]);
});

it("creates a ticket with valid inputs", async () => {
  // add in check to make sure a ticket was saved
  let tickets = await Ticket.find({}).lean();
  expect(tickets.length).toEqual(0);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "validTitle",
      price: 20,
    })
    .expect(201);

  tickets = await Ticket.find({}).lean();
  expect(tickets.length).toEqual(1);

  const ticket = tickets[0];
  expect(ticket.title).toEqual("validTitle");
  return expect(ticket.price).toEqual(20);
});
