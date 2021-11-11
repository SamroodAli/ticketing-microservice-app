import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  return <div>{JSON.stringify(currentUser)}</div>;
};

export async function getServerSideProps(context) {
  // url can be "http://auth-srv:3000/api/users/currentuser"
  // buildClient gives us back axios instance with baseurl configured
  try {
    const { data } = await buildClient(context).get("/api/users/currentuser");
    return { props: data };
  } catch (err) {
    console.log(err);
    return {
      props: { data: null },
    };
  }
}

export default LandingPage;
