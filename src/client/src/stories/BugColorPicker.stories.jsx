import BugColorPicker from "@core/BugColorPicker";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";
import { useArgs } from "@storybook/preview-api";
import { useEffect, useState } from "react";

const StatefulColorPicker = ({ color: propColor, updateArgs, ...args }) => {
    const [localColor, setLocalColor] = useState(propColor);

    useEffect(() => {
        setLocalColor(propColor);
    }, [propColor]);

    const handleColorChange = (colorObject) => {
        const newHex = colorObject?.hex;
        if (newHex) {
            setLocalColor(newHex);
            updateArgs({ color: newHex });
        }
        args.onColorChange?.(colorObject);
    };

    return <BugColorPicker {...args} color={localColor} onColorChange={handleColorChange} />;
};

export default {
    title: "BUG Core/Controls/BugColorPicker",
    component: BugColorPicker,
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
                component: `A control for selecting colors. <br />
                    Note: The <b>onColorChange</b> callback returns a color object (e.g., { hex: "#ff3822" }).`,
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
        color: "#ff3822",
    },
    argTypes: {
        onColorChange: { action: "changed", table: { disable: true } },
        color: {
            control: "color",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "#ff3822" },
            },
        },
    },
};

export const Default = {
    render: (args) => {
        const [currentArgs, updateArgs] = useArgs();

        return (
            <div style={{ padding: "20px", maxWidth: "600px" }}>
                <StatefulColorPicker {...args} color={currentArgs.color} updateArgs={updateArgs} />
            </div>
        );
    },
};
