import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from "@devstoic-learning/ticketing";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
