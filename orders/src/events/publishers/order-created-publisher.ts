import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from "@devstoic-learning/ticketing";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
