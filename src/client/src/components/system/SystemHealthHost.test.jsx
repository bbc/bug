import * as ApiPollerModule from "@hooks/ApiPoller";
import { render } from "@testing-library/react";
import { vi } from "vitest";
import SystemHealthHost from "./SystemHealthHost";

vi.mock("@hooks/ApiPoller");
vi.mock("@core/BugLoading", () => ({
    default: () => <div>Loading</div>,
}));
vi.mock("@core/BugDetailsTable", () => ({
    default: () => <div>DetailsTable</div>,
}));
vi.mock("@core/BugGauge", () => ({
    default: () => <div>Gauge</div>,
}));
vi.mock("@core/BugNoData", () => ({
    default: () => <div>NoData</div>,
}));
vi.mock("javascript-time-ago", () => ({
    default: class TimeAgo {
        format(ms) {
            return `${Math.floor(ms / 1000)} seconds ago`;
        }
    },
}));

const mockUseApiPoller = vi.mocked(ApiPollerModule.useApiPoller);

describe("SystemHealthHost", () => {
    it("renders loading state", () => {
        mockUseApiPoller.mockReturnValue({
            status: "loading",
            data: null,
            error: null,
        });

        const { container } = render(<SystemHealthHost />);
        expect(container.textContent).toContain("Loading");
    });

    it("renders idle state", () => {
        mockUseApiPoller.mockReturnValue({
            status: "idle",
            data: null,
            error: null,
        });

        const { container } = render(<SystemHealthHost />);
        expect(container.textContent).toContain("Loading");
    });

    it("renders health data on success", () => {
        mockUseApiPoller.mockReturnValue({
            status: "success",
            data: {
                uptime: 3600,
                cpu: {
                    manufacturer: "Intel",
                    brand: "Core i7",
                },
                memory: {
                    used: 4294967296,
                    used_text: "4 GB",
                    free: 8589934592,
                    free_text: "8 GB",
                    total: 12884901888,
                    total_text: "12 GB",
                },
                disk: {
                    images: 1073741824,
                    images_text: "1 GB",
                    containers: 2147483648,
                    containers_text: "2 GB",
                    volumes: 1073741824,
                    volumes_text: "1 GB",
                    buildCache: 536870912,
                    buildCache_text: "512 MB",
                    total: 4831838208,
                    total_text: "4.5 GB",
                },
            },
            error: null,
        });

        const { container } = render(<SystemHealthHost />);
        expect(container.textContent).not.toContain("Loading");
    });

    it("should show BugNoData when API returns failure with null data", () => {
        mockUseApiPoller.mockReturnValue({
            status: "failure",
            data: null,
            error: "API error",
        });

        const { container } = render(<SystemHealthHost />);
        expect(container.textContent).toContain("NoData");
    });
});
