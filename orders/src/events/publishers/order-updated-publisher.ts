import {
  Publisher,
  OrderUpdatedEvent,
  Subjects,
} from "@devstoic-learning/ticketing";

export class OrderUpdatedPublisher extends Publisher<OrderUpdatedEvent> {
  readonly subject = Subjects.OrderUpdated;
}
