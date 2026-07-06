import BugBitrateAutocomplete from "@core/BugBitrateAutocomplete";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";
import { useEffect, useState } from "react";

export default {
    title: "BUG Core/Controls/BugBitrateAutocomplete",
    component: BugBitrateAutocomplete,
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
                component: `A bitrate autocomplete control with BUG styling. Preset options are specified as an array of kbps values and displayed in the dropdown with Mbps labels. The input field always shows the raw kbps value. Free text entry is supported — values outside the optional min/max range are clamped, and non-numeric input falls back to the min (if set).`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        value: 8192,
        options: [32768, 25600, 20480, 16384, 12288, 10240, 8192, 6144, 5120, 4096, 3072, 2048, 1024, 512],
        min: undefined,
        max: undefined,
        fullWidth: true,
        disabled: false,
        sx: {},
    },

    argTypes: {
        value: {
            description: "The current bitrate value in kbps.",
            table: { type: { summary: "number" } },
        },
        options: {
            description:
                "Array of preset bitrate values in kbps. Each entry is displayed in the dropdown with a Mbps label.",
            table: { type: { summary: "number[]" }, defaultValue: { summary: "[]" } },
        },
        min: {
            description:
                "Minimum allowed value in kbps. Values below this are clamped. Non-numeric input defaults to this value.",
            control: { type: "number" },
            table: { type: { summary: "number" } },
        },
        max: {
            description: "Maximum allowed value in kbps. Values above this are clamped.",
            control: { type: "number" },
            table: { type: { summary: "number" } },
        },
        onChange: {
            description: "Callback fired with the new kbps value as a number.",
            control: { disable: true },
            table: { type: { summary: "function" } },
        },
        disabled: {
            description: "Disables the control.",
            table: { type: { summary: "boolean" }, defaultValue: { summary: false } },
        },
        fullWidth: {
            description: "If true, the control stretches to fill its container.",
            table: { type: { summary: "boolean" }, defaultValue: { summary: true } },
        },
        sx: {
            description: "MUI style overrides (the sx prop).",
            table: { type: { summary: "object" } },
        },
    },
};

export const Default = {
    render: (args) => {
        const [value, setValue] = useState(args.value);

        useEffect(() => {
            setValue(args.value);
        }, [args.value]);

        return (
            <div style={{ padding: "20px", maxWidth: "600px" }}>
                <BugBitrateAutocomplete {...args} value={value} onChange={setValue} />
            </div>
        );
    },
};

export const WithMinMax = {
    args: {
        value: 8192,
        min: 2048,
        max: 16384,
    },
    render: (args) => {
        const [value, setValue] = useState(args.value);

        return (
            <div style={{ padding: "20px", maxWidth: "600px" }}>
                <BugBitrateAutocomplete {...args} value={value} onChange={setValue} />
            </div>
        );
    },
};

export const Disabled = {
    args: {
        value: 8192,
        disabled: true,
    },
    render: (args) => (
        <div style={{ padding: "20px", maxWidth: "600px" }}>
            <BugBitrateAutocomplete {...args} onChange={() => {}} />
        </div>
    ),
};
