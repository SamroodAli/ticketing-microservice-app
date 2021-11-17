import nats from "node-nats-streaming";

console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
}); //stan is client

stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  const event = JSON.stringify({
    id: "123",
    title: "concert",
    price: 20,
  });

  stan.publish("ticket:created", event, () => {
    console.log("published");
  });
});
