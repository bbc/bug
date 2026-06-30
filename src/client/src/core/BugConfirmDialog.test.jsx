import { render } from "@testing-library/react";
import BugConfirmDialog from "./BugConfirmDialog";

describe("BugConfirmDialog", () => {
    it("renders", () => {
        render(
            <BugConfirmDialog open title="Confirm" message="Are you sure?" onConfirm={() => {}} onDismiss={() => {}} />
        );
    });
});
