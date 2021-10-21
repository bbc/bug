import React from "react";
import { Scrollbars } from "react-custom-scrollbars";

export default function BugScrollbars({ children }) {
    return <Scrollbars>{children}</Scrollbars>;
}
