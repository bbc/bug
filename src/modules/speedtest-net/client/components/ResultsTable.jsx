import BugApiTable from "@core/BugApiTable";
import BugNoData from "@core/BugNoData";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import PendingIcon from "@mui/icons-material/Pending";
import { Box } from "@mui/material";
import AxiosDelete from "@utils/AxiosDelete";
import { useAlert } from "@utils/Snackbar";

export default function ResultsTable({ panelId, limit = 10 }) {
    const sendAlert = useAlert();

    const renderStatusIcon = (icon) => {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    minHeight: 24,
                }}
            >
                {icon}
            </Box>
        );
    };

    const formatDateTime = (isoTimestamp) => {
        const date = new Date(Date.parse(isoTimestamp));
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

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
                            if (item.statusRowType === "scheduled") {
                                return renderStatusIcon(<HourglassTopIcon sx={{ color: "warning.main" }} />);
                            }
                            if (item.statusRowType === "running") {
                                return renderStatusIcon(
                                    <AutorenewIcon
                                        sx={{
                                            color: "primary.main",
                                            animation: "spin 1s linear infinite",
                                            "@keyframes spin": {
                                                "0%": { transform: "rotate(0deg)" },
                                                "100%": { transform: "rotate(360deg)" },
                                            },
                                        }}
                                    />
                                );
                            }
                            if (item.running) {
                                return renderStatusIcon(<PendingIcon sx={{ color: "warning.main" }} />);
                            }
                            if (item.failed || item.status === "failed" || item.timedOut) {
                                return renderStatusIcon(<ErrorOutlineIcon sx={{ color: "error.main" }} />);
                            }
                            return renderStatusIcon(<DoneIcon sx={{ color: "success.main" }} />);
                        },
                    },
                    {
                        title: "TEST",
                        noWrap: true,
                        minWidth: 220,
                        content: (item) => {
                            return item?.testSummary;
                        },
                    },
                    {
                        title: "Time",
                        sortable: false,
                        hideWidth: 600,
                        minWidth: 60,
                        noWrap: true,
                        content: (item) => {
                            if (item.statusRowType) {
                                return null;
                            }
                            return formatDateTime(item?.timestamp);
                        },
                    },
                    {
                        title: "Download",
                        noWrap: true,
                        minWidth: 60,
                        content: (item) => {
                            if (item.statusRowType) {
                                return null;
                            }
                            if (item.download?.bandwidth) {
                                return `${Math.round((item.download?.bandwidth / 100000) * 100) / 100}Mb/s`;
                            }
                        },
                    },
                    {
                        title: "Upload",
                        noWrap: true,
                        minWidth: 60,
                        content: (item) => {
                            if (item.statusRowType) {
                                return null;
                            }
                            if (item.upload?.bandwidth) {
                                return `${Math.round((item.upload?.bandwidth / 100000) * 100) / 100}Mb/s`;
                            }
                        },
                    },
                    {
                        title: "Ping",
                        noWrap: true,
                        minWidth: 60,
                        hideWidth: 600,
                        content: (item) => {
                            if (item.statusRowType) {
                                return null;
                            }
                            if (item.ping?.latency) {
                                return `${Math.round(item.ping?.latency)}ms`;
                            }
                        },
                    },
                ]}
                menuItems={[
                    {
                        title: "Delete",
                        icon: <DeleteIcon fontSize="small" />,
                        disabled: (item) => Boolean(item.statusRowType),
                        onClick: handleDeleteClicked,
                    },
                ]}
                apiUrl={`/container/${panelId}/test/result/${limit}`}
                noData={<BugNoData panelId={panelId} title="No test results found" showConfigButton={false} />}
            />
        </>
    );
}
