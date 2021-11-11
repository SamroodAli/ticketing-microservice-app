import { useState } from "react";
import useRequest from "../../hooks/useRequest";
import Form from "../../components/Form";

const SignInForm = () => <Form url="/api/users/signin" caption="Sign in" />;
export default SignInForm;
