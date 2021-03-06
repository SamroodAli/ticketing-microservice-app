import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/Order";
import { Payment } from "../../models/Payment";
import { OrderStatus } from "@devstoic-learning/ticketing";
import { stripe } from "../../stripe";

jest.mock("../../stripe");

it("returns a 404 when purchasing an order that does not exist", async () => {
  return request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "asdf",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that doesnt belong to the user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });

  await order.save();

  return request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "asdf",
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });

  await order.save();

  return request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "asdf",
      orderId: order.id,
    })
    .expect(400);
});

// commented success test becuase of constraints with stripe in India

// it("returns a 201 with valid inputs", async () => {
//   const userId = new mongoose.Types.ObjectId().toHexString();
//   const order = Order.build({
//     id: new mongoose.Types.ObjectId().toHexString(),
//     userId,
//     version: 0,
//     price: 20,
//     status: OrderStatus.Created,
//   });

//   await order.save();

//   await request(app)
//     .post("/api/payments")
//     .set("Cookie", global.signin(userId))
//     .send({
//       token: "tok_visa",
//       orderId: order.id,
//     })
//     .expect(201); // this test fails for india where stripe needs customer name and address

//   const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
//   expect(chargeOptions.source).toEqual("tok_visa");
//   expect(chargeOptions.amount).toEqual(20 * 100);
//   expect(chargeOptions.currency).toEqual("usd");

//   const payment = await Payment.findOne({ orderId: order.id });
//   return expect(payment).not.toBeNull(); // as findOne returns a document or null
// });
