import BugApiTable from "@core/BugApiTable";
import BugNoData from "@core/BugNoData";
import BugPowerIcon from "@core/BugPowerIcon";
import BugStatusLabel from "@core/BugStatusLabel";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Box } from "@mui/material";
export default function ModuleList({ panelId }) {
    return (
        <Box>
            <BugApiTable
                columns={[
                    {
                        title: "Online",
                        sortable: false,
                        noPadding: true,
                        width: 74,
                        field: "online",
                        content: (item) => <BugPowerIcon disabled={!item?.online} />,
                    },
                    {
                        title: "Lock",
                        noPadding: true,
                        hideWidth: 600,
                        width: 60,
                        content: (item) => {
                            if (item.lock) {
                                return <LockIcon sx={{ color: "primary.main" }} />;
                            }
                            return <LockOpenIcon sx={{ color: "text.primary", opacity: 0.1 }} />;
                        },
                    },
                    {
                        title: "Sync",
                        noPadding: true,
                        hideWidth: 600,
                        width: 60,
                        content: (item) => {
                            if (item.sync) {
                                return <BugStatusLabel sx={{ color: "primary.main" }}>YES</BugStatusLabel>;
                            }
                            return <BugStatusLabel sx={{ color: "text.primary", opacity: 0.1 }}>NO</BugStatusLabel>;
                        },
                    },
                    {
                        title: "Title",
                        content: (item) => <>{item?.title}</>,
                    },
                    {
                        title: "Device Type",
                        hideWidth: 800,
                        content: (item) => <>{item?.deviceType}</>,
                    },
                    {
                        title: "Firmware Version",
                        hideWidth: 1024,
                        content: (item) => <>{item?.fw_version}</>,
                    },
                ]}
                apiUrl={`/container/${panelId}/module/`}
                panelId={panelId}
                hideHeader={false}
                noData={<BugNoData panelId={panelId} title="No modules found" showConfigButton={false} />}
                rowHeight="62px"
            />
        </Box>
    );
}
