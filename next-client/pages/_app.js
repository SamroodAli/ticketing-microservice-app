import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/Header";

console.log(Header);
function MyApp({ Component, pageProps, currentUser }) {
  return (
    <>
      <Header currentUser={currentUser} />
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
