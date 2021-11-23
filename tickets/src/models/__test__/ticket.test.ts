import { Ticket } from "../Ticket";

it("implements optimistic concurrency control", async () => {
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 5,
    userId: "123",
  });
  // save the ticket to the database
  await ticket.save();
  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);
  // make two seperate changes to the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });
  // save the first ticket
  await firstInstance!.save();
  // save the second one with incorrrect version and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }
  throw new Error("second instance saved");
});
