import BugCard from "@core/BugCard";
import { CardContent, CardHeader, Paper } from "@mui/material";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Layout/BugCard",
    component: BugCard,
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
                component: `A card control for displaying content in a panel.<br />
                Usually contains a header and content.<br />
                See https://mui.com/components/cards/ for more details`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [
        (Story) => (
            <div style={{ margin: "1em", maxWidth: "300px" }}>
                <Story />
            </div>
        ),
    ],

    args: {
        fullHeight: false,
        sx: {},
    },

    argTypes: {
        children: {
            control: {
                disable: true,
            },
            description: "The controls to display inside the card",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "null" },
            },
        },
        fullHeight: {
            description: "Whether to expand height of card to fill siblings in the same row",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
            },
        },
        sx: {
            description: "An object containing style overrides - see MaterialUI docs for options",
            table: {
                type: { summary: "object" },
                defaultValue: { summary: "{}" },
            },
        },
    },
};

export const Default = {
    render: (args) => (
        <div style={{ padding: "20px", maxWidth: "600px" }}>
            <BugCard {...args}>
                <CardHeader component={Paper} square elevation={0} title="Example Card" />
                <CardContent>This is the card content. It can contain a variety of components.</CardContent>
            </BugCard>
        </div>
    ),
};
