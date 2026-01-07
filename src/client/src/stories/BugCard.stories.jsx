import BugCard from "@core/BugCard";
import { CardContent, CardHeader, Paper } from "@mui/material";
export default {
    title: "BUG Core/Layout/BugCard",
    component: BugCard,
    parameters: {
        docs: {
            description: {
                component: `A card control for displaying content in a panel.<br />
                Usually contains a header and content.<br />
                See https://mui.com/components/cards/ for more details`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "300px" }}>{Story()}</div>],

    argTypes: {
        children: {
            control: {
                disable: true,
            },
            type: { name: "data", required: true },
            description: "The controls to display inside the card",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        fullHeight: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether to expand height of card to fill siblings in the same row",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        sx: {
            type: { name: "data" },
            defaultValue: {},
            description:
                "An object containing style overrides - see MaterialUI docs for options: https://mui.com/system/getting-started/the-sx-prop/",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "{}" },
            },
        },
    },
};

export const MyBugCard = (args) => (
    <BugCard {...args}>
        <CardHeader component={Paper} square elevation={0} title="Example Card" />
        <CardContent>This is the card content. It can contain a variety of components.</CardContent>
    </BugCard>
);

MyBugCard.displayName = "BugCard";
MyBugCard.storyName = "BugCard";
