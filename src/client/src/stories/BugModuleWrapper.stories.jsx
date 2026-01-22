import { Controls, Description, Source, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Wrappers/BugModuleWrapper",
    component: "div",
    parameters: {
        docs: {
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Description />
                    <Source
                        language="jsx"
                        dark
                        code={`
import React from "react";
import MainPanel from "./panels/MainPanel";
import ConfigPanel from "./panels/ConfigPanel";
import EditPanel from "./panels/EditPanel";
import BugModuleWrapper from "@core/BugModuleWrapper";
import { Route, Routes } from "react-router-dom";

export default function Module(props) {
    return (
        <BugModuleWrapper {...props}>
            <Routes>
                <Route index element={<MainPanel {...props} />} />
                <Route path="/:sourceGroup/:destinationGroup" element={<MainPanel {...props} />} />
                <Route path="/edit" element={<EditPanel {...props} />} />
                <Route path="/edit/:sourceGroup/:destinationGroup" element={<EditPanel {...props} />} />
                <Route path="/config" element={<ConfigPanel {...props} />} />
            </Routes>
        </BugModuleWrapper>
    );
}
`}
                    />
                    <Story />
                    <Controls />
                </>
            ),
            description: {
                component: `This component provides a handy wrapper for module pages.<br />
                It takes a <b>panelId</b> and children, and pulls the panelConfig from Redux.<br />
                It automatically handles content visibility based on panel availability and memoizes children to prevent unnecessary re-renders.`,
            },
        },
    },

    argTypes: {
        children: {
            control: { disable: true },
            description: "The routed components or panel content to display.",
            table: {
                type: { summary: "ReactNode" },
                defaultValue: { summary: "null" },
            },
        },
        panelId: {
            control: { disable: true },
            description: "The unique ID of the current panel (used to fetch config from Redux).",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" },
            },
        },
    },
};

export const Default = {
    render: (args) => (
        <div style={{ padding: "20px" }}>
            <div style={{ padding: "20px", textAlign: "center", color: "#666", border: "1px dashed #ccc" }}>
                [ BugModuleWrapper: Routing and Redux logic is active here ]
                <br />
                <small>(Children components would render in this area)</small>
            </div>
        </div>
    ),
};
