import { act, renderHook } from "@testing-library/react";
import axios from "axios";
import { useConfigFormHandler } from "./ConfigFormHandler";

vi.mock("axios");

describe("live validation failures", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
        vi.clearAllMocks();
    });

    async function validate(result) {
        act(() => {
            result.current.register("address");
            result.current.setValue("address", "example");
            result.current.validateServer({ target: { value: "example" } }, "address");
        });
        await act(async () => {
            await vi.advanceTimersByTimeAsync(850);
        });
    }

    it("continues to show successful validation results", async () => {
        axios.post.mockResolvedValue({
            data: {
                status: "success",
                data: { validationResults: [{ field: "address", state: true, message: "OK" }] },
            },
        });
        const { result } = renderHook(() => useConfigFormHandler({ panelId: "panel" }));

        await validate(result);

        expect(result.current.validationResults.address).toEqual({ status: "success", message: "OK" });
    });

    it("clears the pending state when optional validation is not implemented", async () => {
        axios.post.mockRejectedValue({ response: { status: 404 } });
        const { result } = renderHook(() => useConfigFormHandler({ panelId: "panel" }));

        await validate(result);

        expect(result.current.validationResults.address).toBeUndefined();
    });

    it.each([
        [502, undefined],
        [504, undefined],
        [404, { code: "PANEL_NOT_FOUND" }],
    ])("shows validation failure for HTTP %s", async (status, data) => {
        axios.post.mockRejectedValue({ response: { status, data } });
        const { result } = renderHook(() => useConfigFormHandler({ panelId: "panel" }));

        await validate(result);

        expect(result.current.validationResults.address).toEqual({
            status: "error",
            message: "Unable to validate this field.",
        });
    });

    it("ignores failures for an outdated value", async () => {
        let rejectRequest;
        axios.post.mockReturnValue(
            new Promise((_resolve, reject) => {
                rejectRequest = reject;
            })
        );
        const { result } = renderHook(() => useConfigFormHandler({ panelId: "panel" }));

        await validate(result);
        act(() => result.current.setValue("address", "new value"));
        await act(async () => rejectRequest({ response: { status: 502 } }));

        expect(result.current.errors.address).toBeUndefined();
    });
});
