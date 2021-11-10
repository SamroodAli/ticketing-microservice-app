import { useState } from "react";
import axios from "axios";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/users/signup", {
        email,
        password,
      });
      console.log(response.data);
    } catch (err) {
      console.error(err.response.data);
      setErrors(err.response.data.errors);
    }
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
      {errors.length && (
        <div className="alert alert-danger">
          <h4>Sorry, please provide valid crendentials</h4>
          <ul className="my-0">
            {errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      )}
      <button className="btn btn-primary">Sign up</button>
    </form>
  );
};

export default SignupForm;
