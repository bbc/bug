import React from "react";
import { useApiPoller } from "@hooks/ApiPoller";
import BugLoading from "@core/BugLoading";
import BugNoData from "@core/BugNoData";
import BugApiTable from "@core/BugApiTable";
import EditIcon from "@mui/icons-material/Edit";
import AxiosGet from "@utils/AxiosGet";
import AxiosDelete from "@utils/AxiosDelete";
import { useForceRefresh } from "@hooks/ForceRefresh";
import { useAlert } from "@utils/Snackbar";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import BugPowerIcon from "@core/BugPowerIcon";
import BugChipDisplay from "@core/BugChipDisplay";

export default function TabDevices({ panelId }) {
    const sendAlert = useAlert();
    const [forceRefresh, doForceRefresh] = useForceRefresh();

    const devices = useApiPoller({
        url: `/container/${panelId}/devices`,
        interval: 5000,
        forceRefresh: forceRefresh,
    });

    const handleDeleteClicked = async (event, item) => {
        if (await AxiosDelete(`/container/${panelId}/devices/${item?.deviceId}`)) {
            sendAlert(`Deleted device ${item?.name}.`, {
                variant: "success",
            });
        } else {
            sendAlert(`Failed to delete ${item?.name}.`, { variant: "error" });
        }
    };

    const handleEditClicked = async (event, item) => {};

    const handleRebootClicked = async (event, item) => {
        if (await AxiosGet(`/container/${panelId}/devices/${item?.deviceId}/reboot`)) {
            sendAlert(`Rebooted device ${item?.name}.`, {
                variant: "success",
            });
        } else {
            sendAlert(`Failed to reboot ${item?.name}.`, { variant: "error" });
        }
    };

    if (devices.status === "idle" || devices.status === "loading") {
        return <BugLoading height="30vh" />;
    }
    if (devices.status === "success" && !devices.data) {
        return <BugNoData title="No devices found, please add some" showConfigButton={false} />;
    }

    return (
        <>
            <BugApiTable
                columns={[
                    {
                        sortable: false,
                        width: 44,
                        field: "connected",
                        content: (item) => <BugPowerIcon disabled={!item.online} />,
                    },
                    {
                        title: "Name",
                        sortable: false,
                        hideWidth: 600,
                        width: 82,
                        content: (item) => {
                            return <>{item?.title}</>;
                        },
                    },
                    {
                        title: "Location",
                        sortable: false,
                        hideWidth: 600,
                        width: 82,
                        content: (item) => {
                            return <>{item?.location}</>;
                        },
                    },
                    {
                        title: "Serial Number",
                        sortable: false,
                        hideWidth: 500,
                        width: 82,
                        content: (item) => {
                            return <>{item?.serialNumber}</>;
                        },
                    },
                    {
                        title: "Groups",
                        sortable: false,
                        hideWidth: 300,
                        width: 82,
                        content: (item) => <BugChipDisplay options={item?.groups} />,
                    },
                ]}
                menuItems={[
                    {
                        title: "Edit",
                        icon: <EditIcon fontSize="small" />,
                        onClick: handleEditClicked,
                    },
                    {
                        title: "Delete",
                        icon: <DeleteIcon fontSize="small" />,
                        onClick: handleDeleteClicked,
                    },
                    {
                        title: "Reboot",
                        icon: <RestartAltIcon fontSize="small" />,
                        onClick: handleRebootClicked,
                    },
                ]}
                apiUrl={`/container/${panelId}/devices/list`}
                noData={<BugNoData panelId={panelId} title="No devices found" showConfigButton={false} />}
            />
        </>
    );
}
