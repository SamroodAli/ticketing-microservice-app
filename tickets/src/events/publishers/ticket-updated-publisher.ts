import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@devstoic-learning/ticketing";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
