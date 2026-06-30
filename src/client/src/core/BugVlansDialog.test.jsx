import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugVlansDialog from "./BugVlansDialog";

vi.mock("@core/BugScrollbars", () => ({
    default: ({ children }) => <div>{children}</div>,
}));

describe("BugVlansDialog", () => {
    it("renders", () => {
        render(
            <BugVlansDialog
                untaggedVlan={1}
                taggedVlans={[]}
                vlans={[{ id: 1 }]}
                onDismiss={() => {}}
                onConfirm={() => {}}
            />
        );
    });
});
