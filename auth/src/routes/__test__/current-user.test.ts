import request from "supertest";
import { app } from "../../app";

it("responds with details about the current user", async () => {
  const signUpResponse = await request(app)
    .post("/api/users/signup")
    .send({ email: "emailvalid@test.com", password: "Password" })
    .expect(201);
  const cookie = signUpResponse.get("set-cookie");
  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .expect(200);
  expect(response.body.currentUser.email).toEqual("emailvalid@test.com");
});
