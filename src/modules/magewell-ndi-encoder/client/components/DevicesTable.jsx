import React from "react";
import BugApiTable from "@core/BugApiTable";
import BugNoData from "@core/BugNoData";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import BugPowerIcon from "@core/BugPowerIcon";
import AxiosPut from "@utils/AxiosPut";
import AxiosPost from "@utils/AxiosPost";
import { useAlert } from "@utils/Snackbar";
import { useSelector } from "react-redux";
import BugLoading from "@core/BugLoading";
import BugTableLinkButton from "@core/BugTableLinkButton";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import { useHistory } from "react-router-dom";
import TimeAgo from "javascript-time-ago";

export default function DevicesTable({ panelId }) {
    const sendAlert = useAlert();
    const panelConfig = useSelector((state) => state.panelConfig);
    const { renameDialog } = useBugRenameDialog();
    const timeAgo = new TimeAgo("en-GB");
    const history = useHistory();

    const handleGotoClicked = (event, item) => {
        window.open(`http://${panelConfig?.data?.devices[item?.deviceId]?.address}`);
    };

    const handleReboot = async (event, item) => {
        let name = item?.name;
        if (!name) {
            name = panelConfig?.data?.devices[item?.deviceId]?.address;
        }
        if (await AxiosPost(`/container/${panelId}/device/${item?.deviceId}/reboot`)) {
            sendAlert(`Rebooting ${name}`, { variant: "success" });
        } else {
            sendAlert(`Failed to reboot ${name}`, { variant: "error" });
        }
    };

    const handleDelete = async (event, item) => {
        let name = item?.name;
        if (!name) {
            name = panelConfig?.data?.devices[item?.deviceId]?.address;
        }
        if (await AxiosPost(`/container/${panelId}/device/${item?.deviceId}/delete`)) {
            sendAlert(`Deleting ${name}`, { variant: "success" });
        } else {
            sendAlert(`Failed to delete ${name}`, { variant: "error" });
        }
    };

    const handleRenameClicked = async (event, item) => {
        event.stopPropagation();

        let result = await renameDialog({
            title: "Rename Device",
            defaultValue: item?.name,
            confirmButtonText: "Rename",
            allowBlank: true,
        });

        if (result === false) {
            return;
        }

        //Default name (if none set) is magewell-end-SERIALNUMBER
        if (result === "") {
            result = `magewell-enc-${item?.serial}`;
        }

        if (await AxiosPut(`/container/${panelId}/device/${item?.deviceId}/rename`, { name: result })) {
            sendAlert(`Renamed device to ${result}`, { broadcast: "true", variant: "success" });
        } else {
            sendAlert(`Failed to rename device to ${result}`, { variant: "error" });
        }
    };

    const handleNdiRenameClicked = async (event, item) => {
        event.stopPropagation();

        let result = await renameDialog({
            title: "NDI Source Name",
            defaultValue: item?.ndi?.name,
            confirmButtonText: "Rename",
            allowBlank: true,
        });

        if (result === false) {
            return;
        }

        //Default name (if none set) is the serial number
        if (result === "") {
            result = `${item?.serial}`;
        }

        if (await AxiosPut(`/container/${panelId}/device/${item?.deviceId}/sourcename`, { name: result })) {
            sendAlert(`NDI Source name of ${item?.name} set to ${result}`, {
                broadcast: "true",
                variant: "success",
            });
        } else {
            sendAlert(`Failed to set NDI Source name of ${item?.name} to ${result}`, {
                broadcast: "true",
                variant: "error",
            });
        }
    };

    const handleDetailsClicked = (event, item) => {
        history.push(`/panel/${panelId}/device/${item.deviceId}`);
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
                    field: "online",
                    content: (item) => <BugPowerIcon disabled={!item?.online} />,
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
                        <BugTableLinkButton onClick={(event) => handleRenameClicked(event, item)}>
                            {item?.name}
                        </BugTableLinkButton>
                    ),
                },
                {
                    sortable: true,
                    defaultSortDirection: "asc",
                    filterType: "text",
                    title: "Source Name",
                    width: "30rem",
                    field: "sourceName",
                    hideWidth: 200,
                    content: (item) => (
                        <BugTableLinkButton onClick={(event) => handleNdiRenameClicked(event, item)}>
                            {item?.ndi?.name}
                        </BugTableLinkButton>
                    ),
                },
                {
                    title: "IP Address",
                    width: "25rem",
                    field: "address",
                    sortable: false,
                    content: (item) => (
                        <BugTableLinkButton onClick={(event) => handleGotoClicked(event, item)}>
                            {panelConfig.data?.devices[item?.deviceId]?.address}
                        </BugTableLinkButton>
                    ),
                },
                {
                    title: "Input",
                    width: "20rem",
                    field: "input",
                    sortable: true,
                    content: (item) => (item.input === "no-signal" ? "No Signal" : item.input),
                },
                {
                    title: "Streams",
                    width: "20rem",
                    field: "streams",
                    sortable: true,
                    content: (item) => (item.online ? item?.ndi["num-clients"] : ""),
                },
                {
                    title: "Uptime",
                    width: "20rem",
                    field: "uptime",
                    sortable: true,
                    content: (item) => (item.uptime ? timeAgo.format(Date.now() - parseInt(item?.uptime) * 1000) : ""),
                },
            ]}
            menuItems={[
                {
                    title: "Goto Webpage",
                    icon: <OpenInNewIcon fontSize="small" />,
                    onClick: handleGotoClicked,
                },
                {
                    title: "Reboot",
                    icon: <RestartAltIcon fontSize="small" />,
                    onClick: handleReboot,
                },
                {
                    title: "Delete",
                    icon: <DeleteIcon fontSize="small" />,
                    onClick: handleDelete,
                },
            ]}
            apiUrl={`/container/${panelId}/device/list`}
            panelId={panelId}
            hideHeader={false}
            noData={
                <BugNoData
                    panelId={panelId}
                    title="No NDI encoders found"
                    message="Check that you've added some encoders"
                    showConfigButton={false}
                />
            }
            rowHeight="62px"
            onRowClick={handleDetailsClicked}
            sortable={true}
        />
    );
}
