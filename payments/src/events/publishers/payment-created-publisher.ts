import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from "@devstoic-learning/ticketing";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
