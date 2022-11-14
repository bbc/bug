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
import DeleteIcon from "@mui/icons-material/Delete";
import BugChipDisplay from "@core/BugChipDisplay";

export default function TabChannels({ panelId }) {
    const sendAlert = useAlert();
    const [forceRefresh, doForceRefresh] = useForceRefresh();

    const channels = useApiPoller({
        url: `/container/${panelId}/channels`,
        interval: 5000,
        forceRefresh: forceRefresh,
    });

    const handleDeleteClicked = async (event, item) => {
        if (await AxiosDelete(`/container/${panelId}/channels/${item?.channelId}`)) {
            sendAlert(`Deleted channel ${item?.name}.`, {
                variant: "success",
            });
        } else {
            sendAlert(`Failed to delete ${item?.name}.`, { variant: "error" });
        }
    };

    const handleEditClicked = async (event, item) => {};

    if (channels.status === "idle" || channels.status === "loading") {
        return <BugLoading height="30vh" />;
    }
    if (channels.status === "success" && !channels.data) {
        return <BugNoData title="No channels found, please add some" showConfigButton={false} />;
    }

    return (
        <>
            <BugApiTable
                columns={[
                    {
                        title: "Number",
                        sortable: false,
                        hideWidth: 300,
                        width: 80,
                        content: (item) => {
                            return <>{item?.number}</>;
                        },
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
                        title: "Protocol",
                        sortable: false,
                        hideWidth: 600,
                        width: 82,
                        content: (item) => {
                            return <>{item?.protocol}</>;
                        },
                    },
                    {
                        title: "Address",
                        sortable: false,
                        hideWidth: 600,
                        width: 82,
                        content: (item) => {
                            return <>{item?.address}</>;
                        },
                    },
                    {
                        title: "Port",
                        sortable: false,
                        hideWidth: 600,
                        width: 82,
                        content: (item) => {
                            return <>{item?.port}</>;
                        },
                    },
                    {
                        title: "Groups",
                        sortable: false,
                        hideWidth: 600,
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
                ]}
                apiUrl={`/container/${panelId}/channels/list`}
                noData={<BugNoData panelId={panelId} title="No channels found" showConfigButton={false} />}
            />
        </>
    );
}
