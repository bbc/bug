import BugDragIcon from "@core/BugDragIcon";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Icons/BugDragIcon",
    component: BugDragIcon,
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
                component: `A handy drag icon to use in tables to indicate that the content is draggable.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        sx: { color: "action.active" },
    },

    argTypes: {
        sx: {
            description: "MUI style overrides (the sx prop).",
            table: {
                type: { summary: "object" },
                defaultValue: { summary: "{}" },
            },
        },
    },
};

export const Default = {
    render: (args) => (
        <div
            style={{
                padding: "20px",
            }}
        >
            <BugDragIcon {...args} />
        </div>
    ),
};
