import { ArgsTable, Description, PRIMARY_STORY, Subtitle, Title } from "@storybook/addon-docs";
import { Source } from "@storybook/addon-docs/blocks";

export default {
    title: "BUG Core/Wrappers/BugModuleWrapper",
    component: "div",
    parameters: {
        docs: {
            description: {
                component: `This component provides a handy wrapper for module pages.<br />
                It takes a panelId and children, and pulls the panelConfig from redux.<br />
                Using this it hides content if the panel is not available, and memoizes the children to prevent re-rendering on panel.data changes.`,
            },
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Description />

                    <Source
                        language="jsx"
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
                    <br />
                    <ArgsTable story={PRIMARY_STORY} />
                </>
            ),
        },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "300px" }}>{Story()}</div>],

    argTypes: {
        children: {
            control: {
                disable: true,
            },
            type: { name: "data", required: true },
            description: "The form controls to display",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        config: {
            control: {
                disable: true,
            },
            type: { name: "string", required: true },
            description: "The id of the current panel",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
    },
};

export const MyBugModuleWrapper = (args) => <></>;

MyBugModuleWrapper.displayName = "BugModuleWrapper";
MyBugModuleWrapper.storyName = "BugModuleWrapper";
