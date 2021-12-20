import buildClient from "../../api/build-client";
import useRequest from "../../hooks/useRequest";
import { useRouter } from "next/router";

const TicketShow = ({ ticket, context }) => {
  const router = useRouter();
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post", //not POST because we are accessing axios.post using axios[method]
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      router.push("/orders/[orderId]", `/orders/${order.id}`),
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
