const LandingPage = ({ currentUser, hello }) => {
  return (
    <div>
      {hello} {currentUser && currentUser.email}
    </div>
  );
};

export default LandingPage;
