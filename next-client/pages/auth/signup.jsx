import { useState } from "react";
import useRequest from "../../hooks/useRequest";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign up </h1>
      <div className="form-group">
        <label htmlFor="emailAddress">Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="emailAddress"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          className="form-control"
        />
      </div>
      {errors}
      <button className="btn btn-primary">Sign up</button>
    </form>
  );
};

export default SignupForm;
