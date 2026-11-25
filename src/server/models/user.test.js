jest.mock("@core/read-json", () => jest.fn());
jest.mock("@core/write-json", () => jest.fn());
jest.mock("@utils/hash", () => jest.fn());
jest.mock("uuid", () => ({ v4: jest.fn() }));
jest.mock("@core/logger", () => () => ({ error: jest.fn() }));

const readJson = require("@core/read-json");
const writeJson = require("@core/write-json");
const hash = require("@utils/hash");
const { v4: uuidv4 } = require("uuid");
const userModel = require("./user");

describe("user model", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        readJson.mockResolvedValue([{ id: "existing", username: "existing-user" }]);
        writeJson.mockResolvedValue(true);
        hash.mockResolvedValue("hashed-password");
        uuidv4.mockReturnValue("new-id");
    });

    test("creates a user with a generated ID and hashed password", async () => {
        await expect(userModel.set({ username: "new-user", password: "password" })).resolves.toBe(true);

        expect(hash).toHaveBeenCalledWith("password");
        expect(writeJson).toHaveBeenCalledWith(
            expect.any(String),
            expect.arrayContaining([
                { id: "new-id", username: "new-user", password: "hashed-password", passwordLength: 8 },
            ])
        );
    });

    test.each([
        ["username", { username: "existing-user" }],
        ["ID", { id: "existing", username: "new-user" }],
    ])("rejects a duplicate %s without writing", async (field, user) => {
        await expect(userModel.set(user)).rejects.toThrow("already exists");
        expect(writeJson).not.toHaveBeenCalled();
    });

    test("hashes an updated password and preserves other fields", async () => {
        await expect(userModel.update("existing", { password: "new-password" })).resolves.toBe(true);

        expect(hash).toHaveBeenCalledWith("new-password");
        expect(writeJson).toHaveBeenCalledWith(expect.any(String), [
            { id: "existing", username: "existing-user", password: "hashed-password", passwordLength: 12 },
        ]);
    });

    test("does not write when updating a missing user", async () => {
        await expect(userModel.update("missing", { password: "password" })).resolves.toBe(false);
        expect(hash).not.toHaveBeenCalled();
        expect(writeJson).not.toHaveBeenCalled();
    });

    test("propagates a storage failure when creating a user", async () => {
        writeJson.mockRejectedValue(new Error("storage unavailable"));

        await expect(userModel.set({ username: "new-user" })).rejects.toThrow("storage unavailable");
    });
});
