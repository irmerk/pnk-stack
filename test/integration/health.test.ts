import request from "supertest";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { app } from "../../src/server";

describe("/health endpoint", () => {
  it("GET success", async () => {
    const response = await request(app.callback()).get("/health");

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveProperty("message", ReasonPhrases.OK);
    expect(response.body).toHaveProperty("timestamp");
    expect(response.body).toHaveProperty("uptime");
  });
});
