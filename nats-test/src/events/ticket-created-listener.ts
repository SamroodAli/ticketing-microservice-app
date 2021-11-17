import { Message } from "node-nats-streaming";
import { Listener } from "./bae-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  // We made this readonly as it needs to be always TicketCreatedEvent's subject(as defined in baseListener) which is Subjects.TicketCreated

  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log("event data", data);
    console.log(data);
    msg.ack();
  }
}
