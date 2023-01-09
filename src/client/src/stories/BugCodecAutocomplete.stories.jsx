import BugCodecAutocomplete from "@core/BugCodecAutocomplete";

export default {
    title: "BUG Core/Controls/BugCodecAutocomplete",
    component: BugCodecAutocomplete,
    parameters: {
        docs: {
            description: {
                component: `An autocomplete dropdown which is populated with items exposed by the codec-apipoller module.<br />
                    Use it in a codec module to select destination or source devices.<br />
                    You can also set the 'addressValue' and 'portValue' props and any matching codec will be displayed.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },
    argTypes: {
        onChange: {
            action: "changed",
            description: "The function to call when the selection is changed. Passes event/item as arguments",
            table: {
                type: { summary: "function" },
                defaultValue: { summary: null },
            },
        },
        addressValue: {
            type: { name: "string" },
            description: "Optionally provide an IP address to pre-select matching codecs",
            defaultValue: "",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        apiUrl: {
            type: { name: "string" },
            description:
                "An API GET endpoint which returns an array containing objects with the following fields: id/label/device/address/port",
            defaultValue: "",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        capability: {
            type: { name: "string" },
            description:
                "An optional capability label - this will be appended to the API URL like this: 'apiUrl/capability'",
            defaultValue: "",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
            control: {
                disable: true,
            },
        },
        disabled: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether the control is disabled",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        label: {
            type: { name: "string", required: true },
            defaultValue: "Search codec database ...",
            description: "Short description to be shown in the control",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        mockApiData: {
            table: { disable: true },
        },
        portValue: {
            type: { name: "string" },
            description: "Optionally provide an IP port to pre-select matching codecs",
            defaultValue: "",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
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
        variant: {
            options: ["filled", "outlined", "standard"],
            description: "The MUI variant of the button. Always use 'standard' in config forms.",
            defaultValue: "outlined",
            control: { type: "select" },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "outlined" },
            },
        },
    },
};

const Template = (args) => (
    <div
        style={{
            maxWidth: "300px",
        }}
    >
        <BugCodecAutocomplete {...args} />
    </div>
);

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
export const MyBugCodecAutocomplete = (args) => <BugCodecAutocomplete mockApiData={mockApiData} {...args} />;

MyBugCodecAutocomplete.displayName = "BugCodecAutocomplete";
MyBugCodecAutocomplete.storyName = "BugCodecAutocomplete";
