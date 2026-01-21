import BugApiTable from "@core/BugApiTable";
import BugPowerIcon from "@core/BugPowerIcon";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import GpsNotFixedIcon from "@mui/icons-material/GpsNotFixed";
import { Box } from "@mui/material";
export default function InterfaceTabDevices({ panelId, interfaceId }) {
    return (
        <BugApiTable
            columns={[
                {
                    title: "Active",
                    field: "active",
                    sortable: true,
                    width: 44,
                    content: (item) => {
                        if (item.active === undefined) {
                            return null;
                        }
                        return <BugPowerIcon disabled={!item.active} />;
                    },
                },
                {
                    title: "Static",
                    sortable: true,
                    field: "static",
                    noPadding: true,
                    hideWidth: 500,
                    width: 82,
                    content: (item) => {
                        if (item.static === undefined) {
                            return null;
                        }
                        return item.static ? (
                            <GpsFixedIcon
                                sx={{
                                    color: "primary.main",
                                    display: "block",
                                    margin: "auto",
                                    minWidth: 36,
                                }}
                            />
                        ) : (
                            <GpsNotFixedIcon
                                sx={{
                                    color: item.active ? "primary.main" : "inherit",
                                    opacity: item.active ? 1 : 0.1,
                                    display: "block",
                                    margin: "auto",
                                    minWidth: 36,
                                }}
                            />
                        );
                    },
                },
                {
                    title: "MAC Address",
                    width: 160,
                    // hideWidth: 1800,
                    sortable: true,
                    filterType: "text",
                    field: "mac",
                    defaultSortDirection: "asc",
                    content: (item) => {
                        return item["mac"];
                    },
                },
                {
                    title: "Address",
                    width: 140,
                    sortable: true,
                    field: "address",
                    defaultSortDirection: "asc",
                    filterType: "text",
                    content: (item) => {
                        return <>{item.address}</>;
                    },
                },
                {
                    title: "Name",
                    noWrap: true,
                    sortable: true,
                    field: "name",
                    defaultSortDirection: "asc",
                    filterType: "text",
                    content: (item) => {
                        return (
                            <>
                                <Box
                                    sx={{
                                        whiteSpace: "nowrap",
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                        color: "#ffffff",
                                        fontFamily: "fontFamily",
                                        fontSize: "0.875rem",
                                        lineHeight: 1.43,
                                        display: "block",
                                        maxWidth: "100%",
                                        textAlign: "left",
                                    }}
                                >
                                    {item.comment ? item.comment : item.hostname}
                                </Box>
                            </>
                        );
                    },
                },
            ]}
            apiUrl={`/container/${panelId}/interface/fdb/${interfaceId}`}
            panelId={panelId}
            defaultSortDirection="asc"
            defaultSortIndex={3}
            hideHeader={false}
            rowHeight="48px"
            sortable
            filterable
        />
    );
}
