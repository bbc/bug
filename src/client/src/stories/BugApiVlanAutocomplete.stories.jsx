import BugApiVlanAutocomplete from "@core/BugApiVlanAutocomplete";

export default {
    title: "BUG Core/API Controls/BugApiVlanAutocomplete",
    component: BugApiVlanAutocomplete,
    parameters: {
        docs: {
            description: {
                component: `An autocomplete dropdown which is designed for use with an API.<br />
                    Triggers the onChange event, and disables the control to allow the new value to be updated.<br />
                    If the value hasn't changed within the timeout period the control is re-enabled.<br />
                    Can be used with a simple array of strings, or with a custom object with a label and value properties.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },
    argTypes: {
        onChange: {
            type: { name: "function", required: true },
            defaultValue: null,
            description:
                "This is called when the selection is changed. Passes event and an object containing untagged and tagged vlan results",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "function" },
                defaultValue: { summary: null },
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
        options: {
            type: { name: "data" },
            description: "An array of available VLANS. Accepts an array of objects with label and id properties.",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "[]" },
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
        timeout: {
            type: { name: "number" },
            description: "Duration to wait (in seconds) before reverting to previous state",
            table: {
                type: { summary: "number" },
                defaultValue: { summary: 8000 },
            },
        },
        taggedValue: {
            type: { name: "data" },
            description: "An numerical array of tagged vlan IDs",
            defaultValue: [101, 102],
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "[]" },
            },
        },
        untaggedValue: {
            type: { name: "number" },
            description: "The ID of the VLAN which is untagged on this interface",
            defaultValue: 103,
            table: {
                type: { summary: "number" },
                defaultValue: { summary: null },
            },
        },
        maxVlan: {
            type: { name: "number" },
            description: "The maximum VLAN that can be set (usually 4094 or 4093)",
            defaultValue: 4094,
            table: {
                type: { summary: "number" },
                defaultValue: { summary: null },
            },
        },
    },
};

export const MyBugApiVlanAutocomplete = (args) => <BugApiVlanAutocomplete {...args} />;
MyBugApiVlanAutocomplete.displayName = "BugApiVlanAutocomplete";
MyBugApiVlanAutocomplete.storyName = "BugApiVlanAutocomplete";
MyBugApiVlanAutocomplete.args = {
    options: [{ label: "VLAN 101", id: 101 }],
    options: [{ label: "VLAN 102", id: 102 }],
    options: [{ label: "VLAN 103", id: 103 }],
};
