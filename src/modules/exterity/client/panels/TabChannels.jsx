import React from "react";
import BugNoData from "@core/BugNoData";
import BugApiTable from "@core/BugApiTable";
import EditIcon from "@mui/icons-material/Edit";
import AxiosDelete from "@utils/AxiosDelete";
import { useAlert } from "@utils/Snackbar";
import DeleteIcon from "@mui/icons-material/Delete";
import BugChipDisplay from "@core/BugChipDisplay";
import { useHistory } from "react-router-dom";

export default function TabChannels({ panelId }) {
    const sendAlert = useAlert();
    const history = useHistory();

    const handleDeleteClicked = async (event, item) => {
        if (await AxiosDelete(`/container/${panelId}/channels/${item?.channelId}`)) {
            sendAlert(`Deleted channel ${item?.name}.`, {
                variant: "success",
            });
        } else {
            sendAlert(`Failed to delete ${item?.name}.`, { variant: "error" });
        }
    };

    const handleEditClicked = (event, item) => {
        history.push(`/panel/${panelId}/channels/edit/${item.channelId}`);
    };

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
                            return <>{item?.protocol.toUpperCase()}</>;
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
