import BugDetailsCard from "@core/BugDetailsCard";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Layout/BugDetailsCard",
    component: BugDetailsCard,
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
                component: `A card control for displaying name/value-style content.<br />
                Internally uses a <b>BugDetailsTable</b> to format the content rows.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },
    argTypes: {
        footerAlert: {
            description: "Optional footer alert object: { severity, title, message }",
            control: "object",
        },
    },
    args: {
        title: "My Details Card",
        width: "50%",
        closable: false,
        collapsible: false,
        collapsed: false,
        footerAlert: null,
        items: [
            { name: "Voltage 1", value: "12.3 V" },
            { name: "Voltage 2", value: "12.1 V" },
        ],
    },
};

export const Default = {
    render: (args) => (
        <div style={{ padding: "20px", maxWidth: "600px" }}>
            <BugDetailsCard {...args} />
        </div>
    ),
};
