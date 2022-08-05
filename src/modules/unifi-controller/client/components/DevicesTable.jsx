import React from "react";
import BugApiTable from "@core/BugApiTable";
import BugNoData from "@core/BugNoData";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import BugPowerIcon from "@core/BugPowerIcon";
import SearchIcon from "@mui/icons-material/Search";
import { useApiPoller } from "@hooks/ApiPoller";
import AxiosGet from "@utils/AxiosGet";
import AxiosPost from "@utils/AxiosPost";
import { useAlert } from "@utils/Snackbar";
import { useSelector } from "react-redux";
import BugLoading from "@core/BugLoading";
import BugTableLinkButton from "@core/BugTableLinkButton";
import { useBugRenameDialog } from "@core/BugRenameDialog";

export default function DevicesTable({ panelId }) {
    const sendAlert = useAlert();
    const panelConfig = useSelector((state) => state.panelConfig);
    const { renameDialog } = useBugRenameDialog();

    const handleGotoClicked = (event, item) => {
        window.open(
            `https://${panelConfig.data.address}:${panelConfig.data.port}/manage/site/${item?.siteId}/devices/1/100`
        );
    };

    const handleReboot = async (event, item) => {
        if (await AxiosGet(`/container/${panelId}/device/reboot/${item.mac}`)) {
            sendAlert(`Rebooting ${item.name}`, { variant: "success" });
        } else {
            sendAlert(`Failed to reboot ${item.name}`, { variant: "error" });
        }
    };

    const handleLocate = async (event, item) => {
        if (await AxiosGet(`/container/${panelId}/device/locate/${item.mac}/enable`)) {
            sendAlert(`Locating ${item.name}`, { variant: "success" });
        } else {
            sendAlert(`Failed to locate ${item.name}`, { variant: "error" });
        }
    };

    const handleRenameClicked = async (event, item) => {
        event.stopPropagation();

        let result = await renameDialog({
            title: "Rename Device",
            defaultValue: item["name"],
            confirmButtonText: "Rename",
            allowBlank: true,
        });

        if (result === false) {
            return;
        }

        //Default name (if none set) is serial number
        if (result === "") {
            result = item["serial"];
        }

        if (await AxiosPost(`/container/${panelId}/device/rename/${item.deviceId}`, { name: result })) {
            sendAlert(`Renamed device to ${result}`, { broadcast: "true", variant: "success" });
        } else {
            sendAlert(`Failed to rename device to ${result}`, { variant: "error" });
        }
    };

    const sites = useApiPoller({
        url: `/container/${panelId}/sites/list`,
        interval: 10000,
    });

    const getSiteName = (item) => {
        if (Array.isArray(sites.data)) {
            for (let site of sites.data) {
                if (site.id === item) {
                    return site.label;
                }
            }
        }
        return "";
    };

    if (panelConfig.status === "loading") {
        return <BugLoading />;
    }

    return (
        <BugApiTable
            columns={[
                {
                    sortable: false,
                    noPadding: true,
                    width: 44,
                    field: "connected",
                    content: (item) => <BugPowerIcon disabled={!item.connected} />,
                },
                {
                    sortable: true,
                    defaultSortDirection: "asc",
                    filterType: "text",
                    title: "Device",
                    width: "30rem",
                    field: "name",
                    hideWidth: 200,
                    content: (item) => (
                        <BugTableLinkButton
                            disabled={item._protected}
                            onClick={(event) => handleRenameClicked(event, item)}
                        >
                            {item.name}
                        </BugTableLinkButton>
                    ),
                },
                {
                    title: "IP Address",
                    width: "25rem",
                    field: "address",
                    sortable: false,
                    content: (item) => item["config_network"]["ip"],
                },
                {
                    title: "Clients",
                    width: "20rem",
                    field: "clients",
                    sortable: true,
                    content: (item) => item["clientCount"],
                },
                {
                    title: "Serial Number",
                    width: "30rem",
                    field: "serial",
                    sortable: false,
                    content: (item) => item["serial"],
                },
                {
                    title: "Site Name",
                    width: "30rem",
                    field: "siteName",
                    sortable: false,
                    content: (item) => getSiteName(item.siteId),
                },
            ]}
            menuItems={[
                {
                    title: "Goto Webpage",
                    icon: <OpenInNewIcon fontSize="small" />,
                    onClick: handleGotoClicked,
                },
                {
                    title: "Locate",
                    icon: <SearchIcon fontSize="small" />,
                    onClick: handleLocate,
                },
                {
                    title: "Reboot",
                    icon: <RestartAltIcon fontSize="small" />,
                    onClick: handleReboot,
                },
            ]}
            apiUrl={`/container/${panelId}/device/list`}
            panelId={panelId}
            hideHeader={false}
            noData={
                <BugNoData
                    panelId={panelId}
                    title="No Unifi Access Points found"
                    message="Adjust your controller settings."
                    showConfigButton={true}
                />
            }
            rowHeight="62px"
            sortable={true}
        />
    );
}
