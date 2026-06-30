import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugRenameDialog from "./BugRenameDialog";

vi.mock("@core/BugTextField");

describe("BugRenameDialog", () => {
    it("renders", () => {
        render(<BugRenameDialog open title="Rename" onRename={() => {}} onDismiss={() => {}} />);
    });
});
