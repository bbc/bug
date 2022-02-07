import BugApiAutocomplete from "../core/BugApiAutocomplete";
import { Title, Subtitle, Description, ArgsTable, Stories, PRIMARY_STORY } from "@storybook/addon-docs";

export default {
    title: "BUG Core/API Controls/BugApiAutocomplete",
    component: BugApiAutocomplete,
    parameters: {
        docs: {
            description: {
                component: `An autocomplete dropdown which is designed for use with an API.<br />
                    Triggers the onChange event, and disables the control to allow the new value to be updated.<br />
                    If the value hasn't changed within the timeout period the control is re-enabled.<br />
                    Can be used with a simple array of strings, or with a custom object with an id and label properties.`,
            },
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Description />
                    <br />
                    <ArgsTable story={PRIMARY_STORY} />
                    <Stories includePrimary={true} title="" />
                </>
            ),
        },
    },
    argTypes: {
        onChange: { action: "changed" },
        options: {
            type: { name: "data", required: true },
            description: "An array of available values to be selected",
            defaultValue: {},
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        freeSolo: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether to allow 'free' text input",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        filterSelectedOptions: {
            type: { name: "boolean" },
            defaultValue: true,
            description: "Whether to remove selected values from the options list",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: true },
            },
        },
        disableClearable: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Disable the option to clear the current value in the control",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
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
        value: {
            type: { name: "string" },
            description: "Selected value",
            defaultValue: "",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
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
        <BugApiAutocomplete {...args} />
    </div>
);

export const WithSimpleArray = Template.bind({});
WithSimpleArray.args = {
    options: ["red", "green"],
    value: "green",
};
WithSimpleArray.story = {
    parameters: {
        docs: {
            storyDescription: `Pass in a simple array of options to the control, and make sure that value is a simple string`,
        },
    },
};

export const WithObjectArray = Template.bind({});
WithObjectArray.args = {
    options: [
        { id: "red", label: "Red" },
        { id: "green", label: "Green" },
    ],
    value: "green",
};
WithObjectArray.story = {
    parameters: {
        docs: {
            storyDescription: `Pass in an array of objects with id and label fields. Values will be matched against the id field.`,
        },
    },
};
