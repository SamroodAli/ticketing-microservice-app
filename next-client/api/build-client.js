import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    // taking the headers from the browser get request and attaching it to the request to auth service
    // for ingress, this has host set in ingress config file ( host property in headers has to match host in ingress config file)
    // also holds cookie if any from the browser needed for validation.
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  }

  return axios.create({
    baseURL: "/",
  });
};

export default buildClient;
