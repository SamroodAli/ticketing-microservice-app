import { Message } from "node-nats-streaming";
import { Listener } from "./BaseListener";

export class TicketCreatedListener extends Listener {
  subject = "ticket:created";
  queueGroupName = "payments-service";

  onMessage(data: any, msg: Message) {
    console.log("event data", data);
    msg.ack();
  }
}
