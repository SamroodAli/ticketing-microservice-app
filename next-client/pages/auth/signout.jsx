import { useEffect } from "react";
import useRequest from "../../hooks/useRequest";
import { useRouter } from "next/router";

const SignOut = () => {
  const router = useRouter();

  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "delete",
    body: {},
    onSuccess: () => router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, [doRequest]);

  return <div>Signing you out...</div>;
};

export default SignOut;
