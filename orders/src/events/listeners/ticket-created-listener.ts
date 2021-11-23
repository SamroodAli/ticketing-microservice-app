import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  TicketCreatedEvent,
} from "@devstoic-learning/ticketing";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/Ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { title, price } = data;
    const ticket = Ticket.build({ title, price });

    await ticket.save();

    msg.ack();
  }
}
