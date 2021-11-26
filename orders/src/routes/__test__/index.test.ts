import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/Ticket";
import mongoose from "mongoose";

const buildTicket = () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  return ticket.save();
};

it("fetches orders for a particular user", async () => {
  // create three tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();
  // create one order as user 1 to
  const userOne = global.signin();
  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id });

  // create two orders with user 2
  const userTwo = global.signin();
  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketTwo.id });
  const { body: orderThree } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketThree.id });

  // making both requests at the same time, destructuring them and renaming ignoring the first order by user1

  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .expect(200);

  return Promise.all([
    expect(response.body.length).toEqual(2),
    expect(response.body[0]._id).toEqual(orderTwo.id),
    expect(response.body[1]._id).toEqual(orderThree.id),
  ]);
  // make request to get orders for user 2
});
