import BugApiAutocomplete from "@core/BugApiAutocomplete";
import { Controls, Description, Stories, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/API Controls/BugApiAutocomplete",
    component: BugApiAutocomplete,
    tags: ["autodocs"],
    parameters: {
        docs: {
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Description />
                    <hr />
                    <Stories />
                    <Controls />
                </>
            ),
            description: {
                component: `An autocomplete dropdown which is designed for use with an API.<br />
                    Triggers the onChange event, and disables the control to allow the new value to be updated.<br />
                    If the value hasn't changed within the timeout period the control is re-enabled.<br />
                    Can be used with a simple array of strings, or with a custom object with an id and label properties.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },
    args: {
        freeSolo: false,
        filterSelectedOptions: true,
        disableClearable: false,
        disabled: false,
        value: "",
    },
    argTypes: {
        onChange: { action: "changed" },
        options: {
            description: "An array of available values to be selected",
            table: {
                type: { summary: "array" },
                defaultValue: { summary: "[]" },
            },
        },
        freeSolo: {
            description: "Whether to allow 'free' text input",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
            },
        },
        filterSelectedOptions: {
            description: "Whether to remove selected values from the options list",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "true" },
            },
        },
        disableClearable: {
            description: "Disable the option to clear the current value in the control",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
            },
        },
        disabled: {
            description: "Whether the control is disabled",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
            },
        },
        value: {
            description: "Selected value",
            table: {
                type: { summary: "string | object" },
            },
        },
    },
    decorators: [
        (Story) => (
            <div style={{ maxWidth: "300px" }}>
                <Story />
            </div>
        ),
    ],
};

/**
 * Pass in a simple array of options to the control, and make sure that value is a simple string.
 */
export const WithSimpleArray = {
    args: {
        options: ["red", "green"],
        value: "green",
    },
    parameters: {
        docs: {
            description: {
                story: "Pass in a simple array of options to the control, and make sure that value is a simple string",
            },
        },
    },
};

/**
 * Pass in an array of objects with id and label fields. Values will be matched against the id field.
 */
export const WithObjectArray = {
    args: {
        options: [
            { id: "red", label: "Red" },
            { id: "green", label: "Green" },
        ],
        value: "green",
    },
    parameters: {
        docs: {
            description: {
                story: "Pass in an array of objects with id and label fields. Values will be matched against the id field.",
            },
        },
    },
};
