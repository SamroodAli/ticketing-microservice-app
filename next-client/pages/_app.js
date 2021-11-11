import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

MyApp.getInitialProps = async (appContext) => {
  try {
    const { data } = await buildClient(appContext.ctx).get(
      "/api/users/currentuser"
    );
    console.log(data);
    return { props: data };
  } catch (err) {
    console.log(err);
    return {
      props: { data: null },
    };
  }
};

export default MyApp;
