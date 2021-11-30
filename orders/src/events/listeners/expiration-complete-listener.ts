import {
  Listener,
  ExpirationCompleteEvent,
  Subjects,
} from "@devstoic-learning/ticketing";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {}
}
