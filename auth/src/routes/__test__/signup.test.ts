import request from "supertest";
import { app } from "../../app";

it("returns a 201 on signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@asdasdasd",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@asdasdasd",
      password: "p",
    })
    .expect(400);
});

it("returns a 400 with a missing password and email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@asdasdasd.com",
    })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({ password: "password" })
    .expect(400);
});
