import jwt from "jsonwebtoken";
import request from "supertest";
import { StatusCodes } from "http-status-codes";

import { app } from "../../src/server";

const JWT = jwt.sign({ sub: "testUser" }, "INVALID_TOKEN");

const jwtError = "JsonWebTokenError";
const authErrMsg = "Authentication Error";

describe("/health endpoint", () => {
  it("GET fails with missing JWT token", async () => {
    const response = await request(app.callback()).get("/failauth");

    expect(response).toMatchObject({
      status: StatusCodes.UNAUTHORIZED,
      body: {
        error: {
          expose: true,
          message: authErrMsg,
          status: StatusCodes.UNAUTHORIZED,
          statusCode: StatusCodes.UNAUTHORIZED,
        },
        message: {
          expose: true,
          message: authErrMsg,
          status: StatusCodes.UNAUTHORIZED,
          statusCode: StatusCodes.UNAUTHORIZED,
        },
        success: false,
      },
    });
  });

  it("POST fails with invalid JWT token", async () => {
    const message = "invalid signature";

    const response = await request(app.callback())
      .post("/create")
      .set("Authorization", `Bearer ${JWT}`)
      .send({});

    expect(response).toMatchObject({
      status: StatusCodes.UNAUTHORIZED,
      body: {
        success: false,
        message: {
          message: authErrMsg,
          originalError: { name: jwtError, message },
          expose: true,
          statusCode: StatusCodes.UNAUTHORIZED,
          status: StatusCodes.UNAUTHORIZED,
        },
        error: {
          message: authErrMsg,
          originalError: { name: jwtError, message },
          expose: true,
          statusCode: StatusCodes.UNAUTHORIZED,
          status: StatusCodes.UNAUTHORIZED,
        },
      },
    });
  });

  it("POST fails with malformed JWT token", async () => {
    const message = "jwt malformed";

    const response = await request(app.callback())
      .post("/create")
      .set("Authorization", "Bearer INVALID_TOKEN")
      .send({});

    expect(response).toMatchObject({
      status: StatusCodes.UNAUTHORIZED,
      body: {
        success: false,
        message: {
          message: authErrMsg,
          originalError: { name: jwtError, message },
          expose: true,
          statusCode: StatusCodes.UNAUTHORIZED,
          status: StatusCodes.UNAUTHORIZED,
        },
        error: {
          message: authErrMsg,
          originalError: { name: jwtError, message },
          expose: true,
          statusCode: StatusCodes.UNAUTHORIZED,
          status: StatusCodes.UNAUTHORIZED,
        },
      },
    });
  });
});
