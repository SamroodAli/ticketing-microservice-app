import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Ticket } from "../../../models/Ticket";
import { OrderCreatedEvent, OrderStatus } from "@devstoic-learning/ticketing";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);
  // nats auto calls onMessage on listening events with two arguments ,data from the event and msg from node-nats-streaming library
  // we are calling onMessage ourselves with fake data and msg objects
  const ticket = Ticket.build({
    title: "concert",
    price: 99,
    userId: "asdf",
  });
  await ticket.save();

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: "asdf",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("sets the orderId of the ticket", async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  // the ticket we have in above 'ticket' variable is outdated, so we have to fetch again with the id
  const updatedTicket = await Ticket.findById(ticket.id);
  return expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the message", async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  return expect(msg.ack).toHaveBeenCalled();
});
