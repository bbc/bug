jest.mock("@models/user", () => ({
    set: jest.fn(),
    get: jest.fn(),
    update: jest.fn(),
}));
jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const userModel = require("@models/user");
const userSet = require("./user-set");
const userGet = require("./user-get");
const userUpdate = require("./user-update");
const userEnable = require("./user-enable");

describe("user management services", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("normalizes username and email before creating a user", async () => {
        userModel.set.mockResolvedValue(true);

        const result = await userSet({ username: "  TestUser  ", email: "  Test@Example.COM  ", firstName: "Test" });

        expect(result).toBe(true);
        expect(userModel.set).toHaveBeenCalledWith({
            username: "testuser",
            email: "test@example.com",
            firstName: "Test",
        });
    });

    test("removes the password from a retrieved user", async () => {
        userModel.get.mockResolvedValue({ id: "user-1", username: "tester", password: "hashed-password" });

        await expect(userGet("user-1")).resolves.toEqual({ id: "user-1", username: "tester" });
    });

    test("returns null for a missing user ID without reading the model", async () => {
        await expect(userGet(null)).resolves.toBeNull();
        expect(userModel.get).not.toHaveBeenCalled();
    });

    test.each([true, false])("updates a user's enabled state to %s", async (enabled) => {
        userModel.update.mockResolvedValue(true);

        await expect(userEnable("user-1", enabled)).resolves.toBe(true);
        expect(userModel.update).toHaveBeenCalledWith("user-1", { enabled });
    });

    test.each([
        ["create", () => userSet({ username: "tester" }), "set", "Failed to update user."],
        ["update", () => userUpdate("user-1", { firstName: "Test" }), "update", "Failed to update user."],
        ["change state", () => userEnable("user-1", false), "update", "Failed to change the user state."],
        ["retrieve", () => userGet("user-1"), "get", "Failed to retrieve user."],
    ])("reports model errors when trying to %s a user", async (operation, call, method, message) => {
        userModel[method].mockRejectedValue(new Error("storage unavailable"));

        await expect(call()).rejects.toThrow(message);
    });
});
