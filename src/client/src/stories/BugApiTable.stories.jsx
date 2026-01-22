import BugApiSwitch from "@core/BugApiSwitch";
import BugApiTable from "@core/BugApiTable";
import BugPowerIcon from "@core/BugPowerIcon";
import CheckIcon from "@mui/icons-material/Check";
import CommentIcon from "@mui/icons-material/Comment";
import EditIcon from "@mui/icons-material/Edit";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { action } from "@storybook/addon-actions";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

const handleMenuClicked = (row, menuItem) => {
    action("menuClicked")(row, menuItem);
};

export default {
    title: "BUG Core/API Controls/BugApiTable",
    component: BugApiTable,
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
                component: `A table control which integrates with BUG module APIs.<br />
                Provides sorting, filtering and item menu capabilities.<br />
**Please Note**: filtering and supporting are not implemented on this storybook`,
            },
        },
        controls: { sort: "requiredFirst" },
    },
    args: {
        apiUrl: "/container/yourpanelid/endpoint/",
        defaultSortDirection: "asc",
        defaultSortIndex: 0,
        filterable: false,
        hideHeader: false,
        highlightColor: "primary.main",
        rowHeight: "48px",
        showNavArrow: false,
        sortable: false,
        sx: {},
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
        menuItems: [
            {
                title: "View Details",
                icon: <SettingsInputComponentIcon fontSize="small" />,
                onClick: handleMenuClicked,
            },
            { title: "-" },
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
            { title: "-" },
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
            { title: "-" },
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
                { id: 1, title: "GigabitEthernet1", enabled: true, link_state: false, tx_bytes: "-", rx_bytes: "-" },
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
                { id: 4, title: "GigabitEthernet4", enabled: false, link_state: false, tx_bytes: "-", rx_bytes: "-" },
            ],
        },
    },
    argTypes: {
        onRowClick: { action: "rowClicked" },
    },
};

export const Default = {
    render: (args) => (
        <div style={{ padding: "20px", maxWidth: "600px" }}>
            <BugApiTable {...args} />
        </div>
    ),
};
