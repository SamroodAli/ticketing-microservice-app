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

it("publishes a ticket updated event", async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  // we can test the data pubished as we called a jest mock in the above line instead of the real client publish function
  // we get the arguments that were passed in the above mock function
  // publish took three arguments, subject, data and a callback
  // the mock.calls returns a nested array with the first item being the arguments passed in
  // and we are getting the second argument with index 1
  const argumentsToMockFunction = (natsWrapper.client.publish as jest.Mock).mock
    .calls[0][1];

  // we stringified the data passing in, so we need to parse it back to test it.
  const ticketUpdatedData = JSON.parse(argumentsToMockFunction);
  expect(ticketUpdatedData.orderId).toEqual(data.id); //data is the data of order that was created which would be orderId of the ticket published
});
