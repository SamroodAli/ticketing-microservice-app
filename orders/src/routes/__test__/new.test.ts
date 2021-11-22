import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/Ticket";
import { Order, OrderStatus } from "../../models/Order";

it("returns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();

  return request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId })
    .expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });

  await ticket.save();
  const order = Order.build({
    ticket,
    userId: "Sadasdasdasdasd",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  await order.save();

  return request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });

  await ticket.save();
  return request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it.todo("emits an order created event");
