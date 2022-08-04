import React from "react";
import BugApiTable from "@core/BugApiTable";
import BugNoData from "@core/BugNoData";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
import { useApiPoller } from "@hooks/ApiPoller";
import AxiosGet from "@utils/AxiosGet";
import { useAlert } from "@utils/Snackbar";

export default function DevicesTable({ panelId }) {
    const sendAlert = useAlert();
    const handleGotoClicked = (event, item) => {
        window.open(`http://${item?.address}`);
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

    return (
        <BugApiTable
            columns={[
                {
                    sortable: true,
                    defaultSortDirection: "asc",
                    filterType: "text",
                    title: "Device",
                    width: "30rem",
                    field: "name",
                    hideWidth: 200,
                    content: (item) => item["name"],
                },
                {
                    title: "IP Address",
                    width: "30rem",
                    field: "address",
                    sortable: false,
                    content: (item) => item["config_network"]["ip"],
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
