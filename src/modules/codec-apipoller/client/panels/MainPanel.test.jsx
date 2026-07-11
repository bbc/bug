import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MainPanel from "./MainPanel";

vi.mock("../components/CodecList", () => ({
    default: ({ panelId }) => <div data-testid="codec-list">panel:{panelId}</div>,
}));

describe("codec-apipoller MainPanel", () => {
    it("renders CodecList with the provided panel id", () => {
        render(<MainPanel panelId="panel-123" />);

        expect(screen.getByTestId("codec-list")).toHaveTextContent("panel:panel-123");
    });
});
