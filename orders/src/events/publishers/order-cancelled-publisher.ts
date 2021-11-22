import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from "@devstoic-learning/ticketing";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
