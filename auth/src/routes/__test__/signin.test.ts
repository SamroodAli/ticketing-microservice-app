import request from "supertest";
import { app } from "../../app";

it("returns a 201 with a successful signin", async () => {
  const credentials = {
    email: "test@asdasdasd.com",
    password: "password",
  };
  await request(app).post("/api/users/signup").send(credentials).expect(201);

  await request(app).post("/api/users/signin").send(credentials).expect(201);
});

it("fails when a email that does not exist is supplied", async () => {
  const credentials = {
    email: "test@2asda.com",
    password: "password",
  };
  await request(app).post("/api/users/signin").send(credentials).expect(400);
});

it("fails when an incorrect password is supplied", async () => {
  const credentials = {
    email: "test@asdasdasd.com",
    password: "password",
  };
  await request(app).post("/api/users/signup").send(credentials).expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@asdasdasd.com",
      password: "pass",
    })
    .expect(400);
});

it("responds with a cookie on successful signin", async () => {
  const credentials = {
    email: "test@cookie.com",
    password: "password",
  };
  await request(app).post("/api/users/signup").send(credentials).expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send(credentials)
    .expect(201);
  expect(response.get("Set-Cookie")).toBeDefined;
});
