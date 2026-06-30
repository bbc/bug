import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import BugAvatar from "./BugAvatar";

vi.mock("@utils/getGravatarUrl", () => ({
    default: vi.fn(() => ""),
}));

describe("BugAvatar", () => {
    it("renders avatar with initials", () => {
        render(<BugAvatar name="John Doe" email="john@example.com" />);
        expect(screen.getByText("JD")).toBeInTheDocument();
    });
});
