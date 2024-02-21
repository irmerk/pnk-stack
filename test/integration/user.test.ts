import axios from "axios";
import request from "supertest";
import jwt from "jsonwebtoken";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { app } from "../../src/server";
import { prisma } from "../../src/libraries";
import * as USER_DATA from "../data/user";

jest.mock("axios");

const JWT = jwt.sign({ sub: "testUser" }, "MOCK_API_KEY");

const setupDB = async () => {
  await prisma.user.createMany({
    data: [...USER_DATA.PG_USERS],
  });
};

const teardownDB = async () => {
  await prisma.user.deleteMany({});
};

describe("/create endpoint", () => {
  beforeAll(async () => {
    await prisma.$connect();
    await setupDB();
  });

  afterEach(async () => {
    await teardownDB();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("POST success", async () => {
    const externalRecordId = "fld0w5s43H647HuWu";

    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: { id: externalRecordId },
    });

    const response = await request(app.callback())
      .post("/create")
      .set("Authorization", `Bearer ${JWT}`)
      .send(USER_DATA.PAYLOAD_SUCCESS);

    expect(response).toMatchObject({
      status: StatusCodes.CREATED,
      body: { message: ReasonPhrases.CREATED, success: true },
    });
    expect(response.error).toBeFalsy();

    const dbRecord = await prisma.user.findUnique({
      where: { externalRecordId: externalRecordId },
    });
    expect(dbRecord).toBeDefined();
  });
});
