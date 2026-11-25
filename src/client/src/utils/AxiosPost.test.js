import axios from "axios";
import AxiosPost from "./AxiosPost";

vi.mock("axios");

describe("AxiosPost", () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.clearAllMocks();
    });

    it("returns false for a 404 by default so actions can show their failure UI", async () => {
        vi.spyOn(console, "log").mockImplementation(() => {});
        axios.post.mockRejectedValue({ response: { status: 404 } });

        await expect(AxiosPost("/container/missing/action")).resolves.toBe(false);
    });

    it("can forward HTTP errors to callers that handle them", async () => {
        const error = { response: { status: 404 } };
        axios.post.mockRejectedValue(error);

        await expect(AxiosPost("/container/panel/validate/field", {}, { throwOnError: true })).rejects.toBe(error);
    });
});
