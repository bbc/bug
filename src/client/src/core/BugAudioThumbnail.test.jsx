import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugAudioThumbnail from "./BugAudioThumbnail";

vi.mock("@core/BugVolumeBar");

describe("BugAudioThumbnail", () => {
    it("renders", () => {
        render(<BugAudioThumbnail src="image.jpg" leftLevel={50} rightLevel={50} min={0} max={100} />);
    });
});
