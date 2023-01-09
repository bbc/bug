import BugApiTable from "@core/BugApiTable";
import BugPowerIcon from "@core/BugPowerIcon";
import BugApiSwitch from "@core/BugApiSwitch";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import CommentIcon from "@mui/icons-material/Comment";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { action } from "@storybook/addon-actions";
import { ArgsTable } from "@storybook/addon-docs";

export default {
    title: "BUG Core/API Controls/BugApiTable",
    component: BugApiTable,
    parameters: {
        docs: {
            description: {
                component: `A table control which integrates with BUG module APIs.<br />
                Provides sorting, filtering and item menu capabilities.<br />
**Please Note**: filtering and supporting are not implemented on this storybook`,
            },
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
        controls: { sort: "requiredFirst" },
    },

    argTypes: {
        onRowClick: {
            action: "rowClicked",
            description: "The function to call when a row is clicked. Passes event/item as arguments",
        },
        apiUrl: {
            type: { name: "string", required: true },
            description: "The URL of the API to call. Must support POST and filtering/sorting if required",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
            control: {
                disable: true,
            },
        },
        columns: {
            type: { name: "data", required: true },
            description: "An array of column definitions - see **BugApiTableColumn** for details",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "[]" },
            },
            control: {
                disable: true,
            },
        },
        defaultSortDirection: {
            options: ["asc", "desc"],
            description: "The default sort direction",
            defaultValue: "asc",
            control: { type: "select" },
            table: {
                type: { summary: "string" },
            },
            control: {
                disable: true,
            },
        },
        defaultSortIndex: {
            type: { name: "number" },
            description: "The index of the column to sort by default",
            defaultValue: 0,
            table: {
                type: { summary: "number" },
                defaultValue: { summary: 0 },
            },
            control: {
                disable: true,
            },
        },
        filterable: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether the table is filterable",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
            control: {
                disable: true,
            },
        },
        forceRefresh: {
            type: "number",
            description: "Change the value of this to force a refresh of the table data source",
            table: {
                type: { summary: "number" },
            },
            control: {
                disable: true,
            },
        },
        hideHeader: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether the table headers are hidden",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        highlightColor: {
            options: ["primary.main", "secondary.main", "error.main", "success.main"],
            defaultValue: "primary.main",
            description: "The color to use for the text in the control - see MaterialUI for options",
            control: { type: "select" },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "primary.main" },
            },
        },
        highlightRow: {
            type: { name: "function" },
            description:
                "A function which passes the item and expects a boolean response - whether or not to highlight the row.",
            table: {
                type: { summary: "function" },
            },
        },
        menuItems: {
            type: "data",
            description: "An array of menu items to be shown via the context menu - see **BugMenuItems** for details",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "[]" },
            },
            control: {
                disable: true,
            },
        },
        mockApiData: {
            table: { disable: true },
        },
        noData: {
            type: "data",
            description: "A react component to dispay if no results are found",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "null" },
            },
            control: {
                disable: true,
            },
        },
        refreshInterval: {
            type: { name: "number", required: false },
            description: "How often to poll the API endpoint in ms",
            table: {
                type: { summary: "number" },
                defaultValue: { summary: "2500" },
            },
            control: {
                disable: true,
            },
        },
        rowHeight: {
            type: "string",
            description: "Override the default row height",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        showNavArrow: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether to show a nav arrow on the right of each row to indicate that navigation is possible",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        sortable: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether the table is sortable",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
            control: {
                disable: true,
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
    },
};

const handleMenuClicked = (row, menuItem) => {
    action("menuClicked")(row, menuItem);
};

export const MyApiTable = (args) => <BugApiTable {...args} />;
MyApiTable.displayName = "BugApiTable";
MyApiTable.storyName = "BugApiTable";
MyApiTable.args = {
    columns: [
        {
            title: "Active",
            sortable: true,
            noPadding: true,
            hideWidth: 440,
            width: 58,
            field: "status",
            filterType: "dropdown",
            filterOptions: [
                { id: "View all items", label: "" },
                { id: "Inactive", label: false },
                { id: "Active", label: true },
            ],
            content: (item) => <BugPowerIcon disabled={!item.link_state} />,
        },
        {
            title: "Enabled",
            sortable: true,
            noPadding: true,
            field: "enabled",
            content: (item) => <BugApiSwitch checked={item.enabled} />,
        },
        {
            title: "Title",
            sortable: true,
            width: "12rem",
            field: "title",
            defaultSortDirection: "asc",
            filterType: "text",
            content: (item) => item.title,
        },
        {
            title: "TX",
            sortable: false,
            width: "12rem",
            field: "tx_bytes",
            content: (item) => item.tx_bytes,
        },
        {
            title: "RX",
            sortable: false,
            width: "12rem",
            field: "rx_bytes",
            content: (item) => item.rx_bytes,
        },
    ],
    rowHeight: "48px",
    menuItems: [
        {
            title: "View Details",
            icon: <SettingsInputComponentIcon fontSize="small" />,
            onClick: handleMenuClicked,
        },
        {
            title: "-",
        },
        {
            title: "Enable",
            disabled: (item) => !item.disabled,
            icon: <ToggleOnIcon fontSize="small" />,
            onClick: handleMenuClicked,
        },
        {
            title: "Disable",
            disabled: (item) => item.disabled,
            icon: <ToggleOffIcon fontSize="small" />,
            onClick: handleMenuClicked,
        },
        {
            title: "-",
        },
        {
            title: "Rename",
            icon: <EditIcon fontSize="small" />,
            onClick: handleMenuClicked,
        },
        {
            title: "Comment",
            icon: <CommentIcon fontSize="small" />,
            onClick: handleMenuClicked,
        },
        {
            title: "-",
        },
        {
            title: "Protect",
            disabled: (item) => item._protected && !item._allowunprotect,
            icon: (item) => (item._protected ? <CheckIcon fontSize="small" /> : null),
            onClick: handleMenuClicked,
        },
    ],
    mockApiData: {
        status: "success",
        data: [
            {
                id: 1,
                title: "GigabitEthernet1",
                enabled: true,
                link_state: false,
                tx_bytes: "-",
                rx_bytes: "-",
            },
            {
                id: 2,
                title: "GigabitEthernet2",
                enabled: true,
                link_state: true,
                tx_bytes: "1.1 Mb/s",
                rx_bytes: "134 Kb/s",
            },
            {
                id: 3,
                title: "GigabitEthernet3",
                enabled: true,
                link_state: true,
                tx_bytes: "92.9 Mb/s",
                rx_bytes: "62.3 Mb/s",
            },
            {
                id: 4,
                title: "GigabitEthernet4",
                enabled: false,
                link_state: false,
                tx_bytes: "-",
                rx_bytes: "-",
            },
        ],
    },
};
MyApiTable.parameters = {
    docs: {
        source: {
            code: `
<BugApiTable
  columns={[
    {
        title: "Active",
        sortable: true,
        noPadding: true,
        hideWidth: 440,
        width: 58,
        field: "status",
        filterType: "dropdown",
        filterOptions: [
            { id: "View all items", label: "" },
            { id: "Inactive", label: false },
            { id: "Active", label: true },
        ],
        content: (item) => <BugPowerIcon disabled={!item.link_state} />,
    },
    {
        title: "Enabled",
        sortable: true,
        noPadding: true,
        field: "enabled",
        content: (item) => <BugApiSwitch checked={item.enabled} />,
    },
    {
        title: "Title",
        sortable: true,
        width: "12rem",
        field: "title",
        defaultSortDirection: "asc",
        filterType: "text",
        content: (item) => item.title,
    },
    {
        title: "TX",
        sortable: false,
        width: "12rem",
        field: "tx_bytes",
        content: (item) => item.tx_bytes,
    },
    {
        title: "RX",
        sortable: false,
        width: "12rem",
        field: "rx_bytes",
        content: (item) => item.rx_bytes,
    },
  ]}
  defaultSortDirection="asc"
  defaultSortIndex={0}
  menuItems={[
    {
        title: "View Details",
        icon: <SettingsInputComponentIcon fontSize="small" />,
        onClick: handleMenuClicked,
    },
    {
        title: "-",
    },
    {
        title: "Enable",
        disabled: (item) => !item.disabled,
        icon: <ToggleOnIcon fontSize="small" />,
        onClick: handleMenuClicked,
    },
    {
        title: "Disable",
        disabled: (item) => item.disabled,
        icon: <ToggleOffIcon fontSize="small" />,
        onClick: handleMenuClicked,
    },
    {
        title: "-",
    },
    {
        title: "Rename",
        icon: <EditIcon fontSize="small" />,
        onClick: handleMenuClicked,
    },
    {
        title: "Comment",
        icon: <CommentIcon fontSize="small" />,
        onClick: handleMenuClicked,
    },
    {
        title: "-",
    },
    {
        title: "Protect",
        disabled: (item) => item._protected && !item._allowunprotect,
        icon: (item) => (item._protected ? <CheckIcon fontSize="small" /> : null),
        onClick: handleMenuClicked,
    },
  ]}
  apiUrl="/container/yourpanelid/endpoint/"
  onRowClick={handleRowClick}
  rowHeight="48px"
/>`,
        },
    },
};
