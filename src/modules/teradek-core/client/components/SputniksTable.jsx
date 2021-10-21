import React from "react";
import { useApiPoller } from "@utils/ApiPoller";
import BugApiTable from "@core/BugApiTable";
import BugPowerIcon from "@core/BugPowerIcon";
import Typography from "@mui/material/Typography";
import LaunchIcon from "@mui/icons-material/Launch";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import VideocamIcon from "@mui/icons-material/Videocam";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import BugTableNoData from "@core/BugTableNoData";
import BugScrollbars from "@core/BugScrollbars";

export default function SputniksTable({ panelId }) {
    const devices = useApiPoller({
        url: `/container/${panelId}/device/`,
        interval: 10000,
    });

    const getLinkedDevices = (item) => {
        if (item.status !== "online") {
            return null;
        }

        const items = [];
        if (item?.inventory) {
            for (let sid of item?.inventory) {
                const selectedDevice = devices.data.find((device) => device.id === sid);
                if (selectedDevice) {
                    items.push(selectedDevice);
                }
            }
        }

        // sort the array
        items.sort((a, b) => a.label.localeCompare(b.label, "en", { sensitivity: "base" }));

        return items.map((eachItem) => (
            <Chip
                sx={{
                    margin: "2px",
                    border: "none",
                    borderRadius: "3px",
                }}
                icon={eachItem.type === "encoder" ? <VideocamIcon /> : <LiveTvIcon />}
                key={eachItem.id}
                label={eachItem.label}
            />
        ));
    };

    const handleCoreClicked = async (event, item) => {
        const url = `https://corecloud.tv/app/servers/sputniks/${item.mac}`;
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
        event.stopPropagation();
        event.preventDefault();
    };

    return (
        <BugApiTable
            columns={[
                {
                    sortable: false,
                    noPadding: true,
                    width: 44,
                    field: "status",
                    content: (item) => <BugPowerIcon enabled={item.status === "online"} />,
                },
                {
                    title: "Name",
                    noWrap: true,
                    width: "20%",
                    content: (item) => (
                        <>
                            <Typography variant="body1">{item.title}</Typography>
                            <Typography variant="subtitle1">{item?.ip}</Typography>
                        </>
                    ),
                },
                {
                    title: "Devices",
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
                            <BugScrollbars>{getLinkedDevices(item)}</BugScrollbars>
                        </Box>
                    ),
                },
            ]}
            menuItems={[
                {
                    title: "View on Core",
                    icon: <LaunchIcon fontSize="small" />,
                    onClick: handleCoreClicked,
                },
            ]}
            apiUrl={`/container/${panelId}/sputnik/`}
            panelId={panelId}
            hideHeader={false}
            rowHeight="126px"
            noData={
                <BugTableNoData
                    panelId={panelId}
                    title="No sputniks found"
                    message="This account contains no sputnik servers"
                    showConfigButton={false}
                />
            }
        />
    );
}
