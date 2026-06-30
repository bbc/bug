import { render } from "@testing-library/react";
import { BugCustomDialogProvider } from "./BugCustomDialog";

describe("BugCustomDialogProvider", () => {
    it("renders", () => {
        render(
            <BugCustomDialogProvider>
                <div>Test</div>
            </BugCustomDialogProvider>
        );
    });
});
