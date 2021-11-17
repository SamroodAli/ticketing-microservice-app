import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@devstoic-learning/ticketing";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
