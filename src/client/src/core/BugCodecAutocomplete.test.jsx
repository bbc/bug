import { render, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import BugCodecAutocomplete from "./BugCodecAutocomplete";

vi.mock("@utils/AxiosGet");

describe("BugCodecAutocomplete", () => {
    it("renders", () => {
        render(<BugCodecAutocomplete mockApiData={[]} onChange={() => {}} />);
    });

    it("resolves value from address/port and notifies parent", async () => {
        const onValueResolved = vi.fn();
        const mockApiData = [
            {
                id: "codec1",
                label: "Codec 101",
                device: "My Device",
                address: "10.0.0.101",
                port: "1001",
                params: { max_sessions: 4 },
            },
        ];

        render(
            <BugCodecAutocomplete
                mockApiData={mockApiData}
                addressValue="10.0.0.101"
                portValue="1001"
                onValueResolved={onValueResolved}
                onChange={() => {}}
            />
        );

        await waitFor(() => {
            expect(onValueResolved).toHaveBeenCalled();
            expect(onValueResolved.mock.calls.at(-1)[0]).toEqual(mockApiData[0]);
        });
    });

    it("uses calculateValue return id to resolve selected option", async () => {
        const calculateValue = vi.fn(({ options }) => {
            return options.find((item) => item.address === "10.0.0.202")?.id;
        });
        const onValueResolved = vi.fn();
        const mockApiData = [
            {
                id: "codec1",
                label: "Codec 101",
                device: "My Device",
                address: "10.0.0.101",
                port: "1001",
            },
            {
                id: "codec2",
                label: "Codec 202",
                device: "My Device",
                address: "10.0.0.202",
                port: "2002",
            },
        ];

        render(
            <BugCodecAutocomplete
                mockApiData={mockApiData}
                addressValue="ignored-by-calculateValue"
                portValue="9999"
                calculateValue={calculateValue}
                onValueResolved={onValueResolved}
                onChange={() => {}}
            />
        );

        await waitFor(() => {
            expect(calculateValue).toHaveBeenCalled();
            expect(
                calculateValue.mock.calls.some(([args]) => {
                    return Array.isArray(args.options) && args.options.length === 2;
                })
            ).toBe(true);
            expect(onValueResolved.mock.calls.at(-1)[0]).toEqual(mockApiData[1]);
        });
    });
});
