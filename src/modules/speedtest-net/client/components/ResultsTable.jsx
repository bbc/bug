import BugApiTable from "@core/BugApiTable";
import BugNoData from "@core/BugNoData";
import React from "react";
import DoneIcon from "@mui/icons-material/Done";
import PendingIcon from "@mui/icons-material/Pending";
import DeleteIcon from "@mui/icons-material/Delete";
import TimeAgo from "javascript-time-ago";
import AxiosDelete from "@utils/AxiosDelete";
import { useAlert } from "@utils/Snackbar";

export default function ResultsTable({ panelId, limit = 10 }) {
    const timeAgo = new TimeAgo("en-GB");
    const sendAlert = useAlert();

    const handleDeleteClicked = async (event, item) => {
        if (item._id) {
            if (await AxiosDelete(`/container/${panelId}/test/result/${item._id}`)) {
                sendAlert(`Deleted test result`, { broadcast: "true", variant: "success" });
            } else {
                sendAlert(`Failed to delete test result`, { variant: "error" });
            }
        }
    };

    return (
        <>
            <BugApiTable
                columns={[
                    {
                        sortable: false,
                        noPadding: true,
                        width: 50,
                        content: (item) => {
                            if (item.running) {
                                return <PendingIcon />;
                            }
                            return <DoneIcon />;
                        },
                    },
                    {
                        title: "Time",
                        sortable: false,
                        hideWidth: 600,
                        minWidth: 60,
                        noWrap: true,
                        content: (item) => {
                            return timeAgo.format(Date.parse(item?.timestamp));
                        },
                    },
                    {
                        title: "Download",
                        noWrap: true,
                        minWidth: 60,
                        content: (item) => {
                            if (item.download?.bandwidth) {
                                return `${Math.round((item.download?.bandwidth / 10000000) * 100) / 100}Mb/s`;
                            }
                        },
                    },
                    {
                        title: "Upload",
                        noWrap: true,
                        minWidth: 60,
                        content: (item) => {
                            if (item.upload?.bandwidth) {
                                return `${Math.round((item.upload?.bandwidth / 10000000) * 100) / 100}Mb/s`;
                            }
                        },
                    },
                    {
                        title: "Ping",
                        noWrap: true,
                        minWidth: 60,
                        hideWidth: 600,
                        content: (item) => {
                            if (item.ping?.latency) {
                                return `${Math.round(item.ping?.latency)}ms`;
                            }
                        },
                    },
                    {
                        title: "Public IP",
                        noWrap: true,
                        minWidth: 80,
                        hideWidth: 600,
                        content: (item) => {
                            if (item.interface?.externalIp) {
                                return item.interface?.externalIp;
                            }
                        },
                    },
                    {
                        title: "ISP",
                        noWrap: true,
                        minWidth: 80,
                        hideWidth: 600,
                        content: (item) => {
                            if (item?.isp) {
                                return item?.isp;
                            }
                        },
                    },
                    {
                        title: "Server",
                        noWrap: true,
                        minWidth: 80,
                        hideWidth: 600,
                        content: (item) => {
                            if (item.server?.name) {
                                return item.server?.name;
                            }
                        },
                    },
                ]}
                menuItems={[
                    {
                        title: "Delete",
                        icon: <DeleteIcon fontSize="small" />,
                        onClick: handleDeleteClicked,
                    },
                ]}
                apiUrl={`/container/${panelId}/test/result/${limit}`}
                noData={
                    <BugNoData
                        panelId={panelId}
                        title="No test results. Run a test to see some results"
                        showConfigButton={false}
                    />
                }
            />
        </>
    );
}
