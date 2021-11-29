import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Ticket } from "../../../models/Ticket";
import mongoose from "mongoose";
import { OrderCancelledEvent } from "@devstoic-learning/ticketing";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "asdf",
  });

  ticket.set({ orderId });
  await ticket.save();
  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, ticket, orderId, listener };
};

it("updates the ticket", async () => {
  const { msg, data, ticket, orderId, listener } = await setup();
  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  return expect(updatedTicket!.orderId).not.toBeDefined();
});

it("updates the ticket,publishes an event and acks the message", async () => {
  const { msg, data, ticket, orderId, listener } = await setup();
  await listener.onMessage(data, msg);
  return expect(msg.ack).toHaveBeenCalled();
});

it("publishes an event", async () => {
  const { msg, data, ticket, orderId, listener } = await setup();
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
  expect(ticketUpdatedData.orderId).not.toBeDefined; //data is the data of order that was created which would be orderId of the ticket published
});
