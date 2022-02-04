import BugCard from "../core/BugCard";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Paper from "@mui/material/Paper";

export default {
    title: "BUG Core/Data/BugCard",
    component: BugCard,
    parameters: {
        docs: {
            description: {
                component: `A card control for displaying content in a panel.<br />
                Usually contains a header and content.<br />
                See https://mui.com/components/cards/ for more details`,
            },
        },
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
    },
};

export const MyBugCard = (args) => (
    <BugCard {...args}>
        <CardHeader component={Paper} square elevation={1} title="Example Card" />
        <CardContent>This is the card content. It can contain a variety of components.</CardContent>
    </BugCard>
);

MyBugCard.displayName = "BugCard";
MyBugCard.storyName = "BugCard";
