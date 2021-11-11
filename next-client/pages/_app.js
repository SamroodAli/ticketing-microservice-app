import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";

function MyApp({ Component, pageProps, currentUser }) {
  return (
    <>
      <h1>Hi {currentUser.email}</h1>
      <Component {...pageProps} />
    </>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const { data } = await buildClient(appContext.ctx).get(
    "/api/users/currentuser"
  );
  return { currentUser: data.currentUser };
};

export default MyApp;
