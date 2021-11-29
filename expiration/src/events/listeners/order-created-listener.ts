import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from "@devstoic-learning/ticketing";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {}
}
