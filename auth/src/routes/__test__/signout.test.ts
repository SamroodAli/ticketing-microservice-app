import request from "supertest";
import { app } from "../../app";

it("cleares the cookie after signout", async () => {
  await request(app).post("/api/users/signup").send({
    email: "test@test.com",
    password: "password",
  });
  const response = await request(app)
    .delete("/api/users/signout")
    .send({})
    .expect(200);

  expect(response.get("Set-Cookie")[0]).toEqual(
    "express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
