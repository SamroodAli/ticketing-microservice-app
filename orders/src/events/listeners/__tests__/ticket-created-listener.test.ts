import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "@devstoic-learning/ticketing";
import mongoose from "mongoose";
import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/Ticket";

const setup = () => {
  const listener = new TicketCreatedListener(natsWrapper.client);

  // nats auto calls onMessage on listening events with two arguments ,data from the event and msg from node-nats-streaming library
  // we are calling onMessage ourselves with fake data and msg objects

  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};

it("creates and saves a ticket", async () => {
  const { listener, data, msg } = setup();
  await listener.onMessage(data, msg);
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  return expect(ticket!.price).toEqual(data.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = setup();
  await listener.onMessage(data, msg);

  return expect(msg.ack).toHaveBeenCalled();
});
