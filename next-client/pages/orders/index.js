import buildClient from "../../api/build-client";

const OrderIndex = ({ orders }) => {
  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>
          {order.ticket.title} - {order.status}
        </li>
      ))}
    </ul>
  );
};

export const getServerSideProps = async (context) => {
  try {
    const { data } = await buildClient(context).get(`/api/orders`);
    return {
      props: {
        orders: data,
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};

export default OrderIndex;
