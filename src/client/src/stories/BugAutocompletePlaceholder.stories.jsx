import BugAutocompletePlaceholder from "@core/BugAutocompletePlaceholder";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Controls/BugAutocompletePlaceholder",
    component: BugAutocompletePlaceholder,
    parameters: {
        docs: {
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Description />
                    <Story />
                    <Controls />
                </>
            ),
            description: {
                component: `A placeholder control to use when a BugAutoComplete control is loading`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        value: "Loading ...",
    },

    argTypes: {
        value: {
            description: "The text to display inside the control",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "Loading ..." },
            },
        },
    },
};

export const Default = {
    render: (args) => (
        <div style={{ padding: "20px", maxWidth: "600px" }}>
            <BugAutocompletePlaceholder {...args} />
        </div>
    ),
};
