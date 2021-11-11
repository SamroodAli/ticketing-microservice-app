import axios from "axios";

const LandingPage = ({ currentUser }) => {
  return <div>{JSON.stringify(currentUser)}</div>;
};

export async function getServerSideProps() {
  // url can be "http://auth-srv:3000/api/users/currentuser"
  console.log("I am in server");
  try {
    const response = await axios
      .get(
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
        { headers: { Host: "ticketing.dev" } } // for ingress, as set host to ticketing.dev
      )
      .catch(console.error);

    return {
      props: { currentUser: response.data.currentUser },
    };
  } catch (err) {
    console.log(err);
    return {
      props: { currentUser: null },
    };
  }
}

export default LandingPage;
