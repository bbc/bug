import BugApiTable from "@core/BugApiTable";
import BugNoData from "@core/BugNoData";
import BugScrollbars from "@core/BugScrollbars";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box } from "@mui/material";
import Chip from "@mui/material/Chip";
export default function InterfaceList({ panelId }) {
    const handleGotoClicked = (event, item) => {
        window.open(`http://${item?.address}`);
    };

    const getGroupChips = (groups) => {
        return groups.map((eachItem) => (
            <Chip
                sx={{
                    margin: "2px",
                    border: "none",
                    borderRadius: "3px",
                }}
                key={eachItem}
                label={eachItem}
            />
        ));
    };

    return (
        <BugApiTable
            columns={[
                {
                    sortable: true,
                    defaultSortDirection: "asc",
                    filterType: "text",
                    title: "Device",
                    width: "30rem",
                    field: "device",
                    hideWidth: 200,
                    content: (item) => item["device"],
                },
                {
                    sortable: true,
                    defaultSortDirection: "asc",
                    filterType: "text",
                    title: "Source",
                    width: "30rem",
                    field: "source",
                    hideWidth: 200,
                    content: (item) => item["source"],
                },
                {
                    title: "Groups",
                    width: "30rem",
                    sortable: false,
                    content: (item) => (
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                bottom: 0,
                                padding: "8px",
                                width: "100%",
                            }}
                        >
                            <BugScrollbars>{getGroupChips(item.groups)}</BugScrollbars>
                        </Box>
                    ),
                },
                {
                    sortable: true,
                    title: "IP Address",
                    defaultSortDirection: "asc",
                    filterType: "text",
                    width: "10rem",
                    field: "address",
                    hideWidth: 600,
                    content: (item) => item["address"],
                },
                {
                    sortable: true,
                    title: "Port",
                    defaultSortDirection: "asc",
                    filterType: "number",
                    width: "10rem",
                    field: "port",
                    hideWidth: 800,
                    content: (item) => item["port"],
                },
            ]}
            menuItems={[
                {
                    title: "Goto Webpage",
                    icon: <OpenInNewIcon fontSize="small" />,
                    onClick: handleGotoClicked,
                },
            ]}
            apiUrl={`/container/${panelId}/source/list`}
            panelId={panelId}
            hideHeader={false}
            noData={
                <BugNoData
                    panelId={panelId}
                    title="No NDI Sources found"
                    message="Click to change the discovery server address."
                    showConfigButton={true}
                />
            }
            rowHeight="62px"
            sortable={true}
        />
    );
}
