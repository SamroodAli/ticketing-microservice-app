import { useEffect, useState } from "react";
import buildClient from "../../api/build-client";
import StripeCheckout from "react-stripe-checkout";

const OrderShow = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState(0);

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
        token={(token) => console.log(token)}
        stripeKey={process.env.NEXT_PUBLIC_STRIPE_KEY}
      />
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
