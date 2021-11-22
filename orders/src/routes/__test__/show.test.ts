import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/Order";
import { Ticket } from "../../models/Ticket";

it("fetches the order", async () => {
  const ticket = await Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();
  const user = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(200);

  return expect(fetchOrder._id).toEqual(order.id);
});

it("returns an error if one user tries to fetch an order of another", async () => {
  const ticket = await Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();
  const user = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  return request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .expect(401);
});
