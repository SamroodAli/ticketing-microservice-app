import { useEffect, useState } from "react";
import buildClient from "../../api/build-client";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/useRequest";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => console.log(payment),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const minutesLeft = new Date(order.expiresAt) - new Date();
      const secondsLeft = Math.round(minutesLeft / 1000);
      setTimeLeft(secondsLeft);
      if (timeLeft < 0) {
        clearInterval(timerId);
      }
    };
    // call immediately to show immediately
    findTimeLeft();
    // set interval
    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, []);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }
  return (
    <div>
      <p>Time left to pay {timeLeft}</p>
      <StripeCheckout
        token={(token) => doRequest({ token: token.id })} //token is an object with metadata on the token which has id property which is the string token we need
        stripeKey={process.env.NEXT_PUBLIC_STRIPE_KEY}
        amount={order.ticket.price * 100} // dollar to cents
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

export const getServerSideProps = async (context) => {
  try {
    const { orderId } = context.params;
    const { data } = await buildClient(context).get(`/api/orders/${orderId}`);
    return {
      props: {
        order: data,
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};

export default OrderShow;
