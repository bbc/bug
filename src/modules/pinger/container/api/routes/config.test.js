const express = require("express");
const request = require("supertest");

jest.mock("@core/config-get", () => jest.fn());
jest.mock("@core/config-put", () => jest.fn());
jest.mock("@services/host-clean", () => jest.fn());

const configPut = require("@core/config-put");
const hostClean = require("@services/host-clean");
const router = require("./config");

test("waits for the configuration update and reports its result", async () => {
    hostClean.mockResolvedValue(true);
    configPut.mockResolvedValue(false);
    const app = express();
    app.use(express.json());
    app.use(router);

    const response = await request(app)
        .put("/")
        .send({ hosts: { host: {} } });

    expect(hostClean).toHaveBeenCalledWith({ host: {} });
    expect(configPut).toHaveBeenCalledWith(undefined, { hosts: { host: {} } });
    expect(response.body).toEqual({ status: "failure", data: false });
});
