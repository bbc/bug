import { Box } from "@mui/material";
import { Controls, Description, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/API Controls/BugApiTableColumn",
    component: Box,
    parameters: {
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
                    <Controls />
                </>
            ),
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        sortable: false,
        noPadding: false,
        noWrap: false,
        width: "auto",
        minWidth: "auto",
        textAlign: "start",
    },

    argTypes: {
        content: {
            description: "The content to be displayed in the cell, usually a React component",
            control: { disable: true },
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "null" },
            },
        },
        sortable: {
            description: "Whether the column supports sorting",
            control: { disable: true },
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
                category: "Sorting",
            },
        },
        hideWidth: {
            description: "Hides the column when it is narrower than this value (in pixels)",
            control: { disable: true },
            table: {
                type: { summary: "number" },
                defaultValue: { summary: "null" },
                category: "Layout",
            },
        },
        width: {
            description: "Desired width of the column. Can be a number or a string with a unit (e.g. '100px')",
            control: { disable: true },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "auto" },
                category: "Layout",
            },
        },
        minWidth: {
            description: "Minimum width of the column. Can be a number or a string with a unit (e.g. '100px')",
            control: { disable: true },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "auto" },
                category: "Layout",
            },
        },
        defaultSortDirection: {
            options: ["asc", "desc"],
            description: "The default sort direction. Required for filtering.",
            control: { disable: true },
            table: {
                type: { summary: "string" },
                category: "Sorting",
            },
        },
        noPadding: {
            description: "If enabled, removes padding from the table cell. Useful for embedded controls",
            control: { disable: true },
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
                category: "Layout",
            },
        },
        noWrap: {
            description: "If enabled, prevents word-wrapping on the cell content",
            control: { disable: true },
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
                category: "Layout",
            },
        },
        filterOptions: {
            description:
                "An array of options to be used in the filter dropdown. These should be objects with a 'name' and 'value' property",
            control: { disable: true },
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "null" },
                category: "Filtering",
            },
        },
        title: {
            description: "The text description to be shown in the table header",
            control: { disable: true },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" },
            },
        },
        field: {
            description: "The field name in the source data. Required for filtering and sorting",
            control: { disable: true },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" },
                category: "Filtering",
            },
        },
        filterType: {
            description: "Either 'text' or 'dropdown'. Required for filtering.",
            control: { disable: true },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" },
                category: "Filtering",
            },
        },
        textAlign: {
            description: "A valid HTML text-align value",
            control: { disable: true },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "start" },
                category: "Layout",
            },
        },
    },
};

export const Default = {
    render: () => (
        <div style={{ fontStyle: "italic", color: "#666", padding: "10px" }}>
            Column configuration (no visual preview)
        </div>
    ),
};
