import BugApiTable from "@core/BugApiTable";
import BugNoData from "@core/BugNoData";
import BugPowerIcon from "@core/BugPowerIcon";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import GpsNotFixedIcon from "@mui/icons-material/GpsNotFixed";
import { Tooltip, Typography } from "@mui/material";

export default function DhcpTable({ panelId, onClick }) {
    return (
        <>
            <BugApiTable
                columns={[
                    {
                        title: "Active",
                        sortable: false,
                        noPadding: true,
                        hideWidth: 740,
                        width: 58,
                        filterOptions: [
                            { id: "View all items", label: "" },
                            { id: "Bound", label: "bound" },
                            { id: "Waiting", label: "waiting" },
                        ],
                        content: (item) => <BugPowerIcon disabled={item.status !== "bound"} />,
                    },
                    {
                        title: "Static",
                        sortable: false,
                        noPadding: true,
                        hideWidth: 800,
                        width: 58,
                        content: (item) => {
                            return item.dynamic ? (
                                <Tooltip title={item.status === "bound" ? "Dynamic - active" : "Dynamic - waiting"}>
                                    <GpsNotFixedIcon
                                        sx={{
                                            color: item.status === "bound" ? "primary.main" : "inherit",
                                            opacity: item.status === "bound" ? 1 : 0.1,
                                            display: "block",
                                            margin: "auto",
                                            minWidth: 36,
                                        }}
                                    />
                                </Tooltip>
                            ) : (
                                <Tooltip title={item.status === "bound" ? "Reserved - active" : "Reserved - waiting"}>
                                    <GpsFixedIcon
                                        sx={{
                                            color: "primary.main",
                                            display: "block",
                                            margin: "auto",
                                            minWidth: 36,
                                        }}
                                    />
                                </Tooltip>
                            );
                        },
                    },
                    {
                        title: "Hostname / Comment",
                        minWidth: 100,
                        noWrap: true,
                        content: (item) => {
                            const nameArray = [item?.hostName, item?.comment].filter(Boolean);
                            return <Typography>{nameArray.join(" / ")}</Typography>;
                        },
                    },
                    {
                        title: "Address",
                        width: 140,
                        sortable: true,
                        field: "address",
                        defaultSortDirection: "asc",
                        content: (item) => item.address,
                    },
                    {
                        title: "MAC Address",
                        width: 160,
                        hideWidth: 900,
                        sortable: true,
                        field: "macAddress",
                        defaultSortDirection: "asc",
                        content: (item) => {
                            return item.macAddress;
                        },
                    },
                    {
                        minWidth: 100,
                        noWrap: true,
                        sortable: true,
                        field: "server",
                        hideWidth: 1024,
                        defaultSortDirection: "asc",
                        title: "Server",
                        content: (item) => {
                            return item.server;
                        },
                    },
                ]}
                defaultSortIndex={3}
                apiUrl={`/container/${panelId}/dhcp/lease`}
                onRowClick={onClick}
                sortable
                rowHeight="58px"
                noData={<BugNoData panelId={panelId} title="No leases found" showConfigButton={false} />}
            />
        </>
    );
}
