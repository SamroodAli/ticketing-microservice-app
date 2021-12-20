import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/Header";

function MyApp({ Component, pageProps, currentUser }) {
  return (
    <>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component {...pageProps} currentUser={currentUser} />
      </div>
    </>
  );
}

MyApp.getInitialProps = async (appContext) => {
  try {
    const { data } = await buildClient(appContext.ctx).get(
      "/api/users/currentuser"
    );

    return {
      currentUser: data.currentUser,
    };
  } catch (err) {
    return { currentUSer: null };
  }
};

export default MyApp;
