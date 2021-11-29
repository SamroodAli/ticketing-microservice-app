import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from "@devstoic-learning/ticketing";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/Ticket";
import { queueGroupName } from "./queue-group-name";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    // if no ticket,throw error
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    // mark the ticket as being reserved
    ticket.set({ orderId: data.id });
    //save the ticket
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });
    msg.ack();
  }
}

export { OrderCreatedListener };
