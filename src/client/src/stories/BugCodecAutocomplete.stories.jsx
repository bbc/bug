import BugCodecAutocomplete from "@core/BugCodecAutocomplete";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Controls/BugCodecAutocomplete",
    component: BugCodecAutocomplete,
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
                component: `An autocomplete dropdown which is populated with items exposed by the codec-apipoller module.<br />
                    Use it in a codec module to select destination or source devices.<br />
                    You can also set the 'addressValue' and 'portValue' props and any matching codec will be displayed.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        addressValue: "",
        apiUrl: "",
        capability: "",
        disabled: false,
        label: "Search codec database ...",
        portValue: "",
        sx: {},
        variant: "outlined",
    },

    argTypes: {
        onChange: {
            action: "changed",
            description: "The function to call when the selection is changed. Passes event/item as arguments",
            table: {
                type: { summary: "function" },
                defaultValue: { summary: "null" },
            },
        },
        addressValue: {
            description: "Optionally provide an IP address to pre-select matching codecs",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" },
            },
        },
        apiUrl: {
            description:
                "An API GET endpoint which returns an array containing objects with the following fields: id/label/device/address/port",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" },
            },
        },
        capability: {
            description:
                "An optional capability label - this will be appended to the API URL like this: 'apiUrl/capability'",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" },
            },
            control: {
                disable: true,
            },
        },
        disabled: {
            description: "Whether the control is disabled",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
            },
        },
        label: {
            description: "Short description to be shown in the control",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" },
            },
        },
        mockApiData: {
            table: { disable: true },
        },
        portValue: {
            description: "Optionally provide an IP port to pre-select matching codecs",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" },
            },
        },
        sx: {
            description: "An object containing style overrides - see MaterialUI docs for options",
            table: {
                type: { summary: "object" },
                defaultValue: { summary: "{}" },
            },
        },
        variant: {
            options: ["filled", "outlined", "standard"],
            description: "The MUI variant of the button. Always use 'standard' in config forms.",
            control: { type: "select" },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "outlined" },
            },
        },
    },
};

const mockApiData = [
    {
        id: "codec1",
        label: "Codec 101",
        device: "My Device",
        address: "10.0.0.101",
        port: "1001",
    },
    {
        id: "codec2",
        label: "Codec 102",
        device: "My Device",
        address: "10.0.0.102",
        port: "1002",
    },
    {
        id: "codec3",
        label: "Codec 103",
        device: "My Device",
        address: "10.0.0.103",
        port: "1003",
    },
    {
        id: "codec4",
        label: "Codec 104",
        device: "My Device",
        address: "10.0.0.104",
        port: "1004",
    },
];

export const Default = {
    render: (args) => (
        <div style={{ padding: "20px", maxWidth: "600px" }}>
            <BugCodecAutocomplete mockApiData={mockApiData} {...args} />
        </div>
    ),
};
