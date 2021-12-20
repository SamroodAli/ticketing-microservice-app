import buildClient from "../../api/build-client";
import useRequest from "../../hooks/useRequest";

const TicketShow = ({ ticket, context }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post", //not POST because we are accessing axios.post using axios[method]
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => console.log(order),
  });

  const onSubmit = (e) => {
    e.preventDefault();
    doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Title: {ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <input type="submit" className="btn btn-primary" value="Purchase" />
    </form>
  );
};

export const getServerSideProps = async (context) => {
  try {
    const { ticketId } = context.params;
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
