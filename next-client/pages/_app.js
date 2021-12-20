import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/Header";

function MyApp({ Component, pageProps, currentUser }) {
  return (
    <>
      <Header currentUser={currentUser} />
      <Component {...pageProps} currentUser={currentUser} />
    </>
  );
}

MyApp.getInitialProps = async (appContext) => {
  try {
    const { data } = await buildClient(appContext.ctx).get(
      "/api/users/currentuser"
    );

    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(
        appContext.ctx,
        client,
        data.currentUSer
      );
      return {
        ...pageProps,
        currentUser: data.currentUser,
      };
    }
    return {
      currentUser: data.currentUser,
    };
  } catch (err) {
    return { currentUSer: null };
  }
};

export default MyApp;
