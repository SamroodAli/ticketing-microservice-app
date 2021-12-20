import buildClient from "../../api/build-client";
const TicketShow = ({ ticket, context }) => {
  console.log(ticket);
  return (
    <div>
      <h1>Title: {ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  try {
    const { ticketId } = context.params;
    console.log(ticketId);
    const { data } = await buildClient(context).get(`/api/tickets/${ticketId}`);
    return {
      props: {
        ticket: data,
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};

export default TicketShow;
