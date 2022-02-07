import Box from "@material-ui/core/Box";
import { Title, Subtitle, Description, ArgsTable, PRIMARY_STORY } from "@storybook/addon-docs";

export default {
    title: "BUG Core/Tables/BugApiTableColumn",
    component: Box,
    parameters: {
        previewTabs: {
            canvas: {
                hidden: true,
            },
        },
        docs: {
            description: {
                component: `An array of these columns can be passed to the BugApiTable component.<br />
                Each column is an object with the following properties:<br />`,
            },
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Description />
                    <br />
                    <ArgsTable story={PRIMARY_STORY} />
                </>
            ),
        },
        controls: { sort: "requiredFirst" },
    },

    argTypes: {
        content: {
            type: { name: "data", required: true },
            description: "The content to be displayed in the cell, usually a React component",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        sortable: {
            type: { name: "boolean" },
            description: "Whether the column supports sorting",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
                category: "Sorting",
            },
        },
        hideWidth: {
            type: { name: "number" },
            description: "Hides the column when it is narrower than this value (in pixels)",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "number" },
                defaultValue: { summary: null },
                category: "Layout",
            },
        },
        width: {
            type: { name: "string" },
            description: "Desired width of the column. Can be a number or a string with a unit (e.g. '100px')",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "auto" },
                category: "Layout",
            },
        },
        minWidth: {
            type: { name: "string" },
            description: "Minimum width of the column. Can be a number or a string with a unit (e.g. '100px')",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "auto" },
                category: "Layout",
            },
        },
        defaultSortDirection: {
            options: ["asc", "desc"],
            description: "The default sort direction. Required for filtering.",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "string" },
                category: "Sorting",
            },
        },
        noPadding: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "If enabled, removes padding from the table cell. Useful for embedded controls",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
                category: "Layout",
            },
        },
        noWrap: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "If enabled, prevents word-wrapping on the cell content",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
                category: "Layout",
            },
        },
        filterOptions: {
            type: "data",
            description:
                "An array of options to be used in the filter dropdown. These should be objects with a 'name' and 'value' property",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "null" },
                category: "Filtering",
            },
        },
        title: {
            type: { name: "string", required: true },
            description: "The text description to be shown in the table header",
            control: {
                disable: true,
            },
            table: {
                defaultValue: { summary: null },
            },
        },
        field: {
            type: { name: "string" },
            description: "The field name in the source data. Required for filtering and sorting",
            control: {
                disable: true,
            },
            table: {
                defaultValue: { summary: null },
                category: "Filtering",
            },
        },
        filterType: {
            type: { name: "string" },
            description: "Either 'text' or 'dropdown'. Required for filtering.",
            control: {
                disable: true,
            },
            table: {
                defaultValue: { summary: null },
                category: "Filtering",
            },
        },
    },
};

export const MyApiTableColumn = (args) => <div {...args} />;
MyApiTableColumn.displayName = "BugApiTableColumn";
MyApiTableColumn.storyName = "BugApiTableColumn";
MyApiTableColumn.args = {};
