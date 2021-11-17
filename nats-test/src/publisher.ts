import nats from "node-nats-streaming";
import { TicketPublisher } from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
}); //stan is alias for a client which is the inverse of nats

stan.on("connect", async () => {
  console.log("Publisher connected to stan");

  const event = {
    id: "123",
    title: "concert",
    price: 20,
  };

  const publisher = new TicketPublisher(stan);
  try {
    await publisher.publish(event);
    console.log("Published");
  } catch (err) {
    console.error(err);
  }
});
