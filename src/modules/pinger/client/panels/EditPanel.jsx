import React, { useState } from "react";
import { useParams } from "react-router-dom";
import BugLoading from "@core/BugLoading";
import HostCardEdit from "../components/HostCardEdit";
import AddCard from "../components/AddCard";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";
import AddDialog from "./../components/AddDialog";
import AxiosPut from "@utils/AxiosPut";
import AxiosDelete from "@utils/AxiosDelete";
import AxiosPost from "@utils/AxiosPost";

import { useAlert } from "@utils/Snackbar";

export default function EditPanel() {
    const params = useParams();
    const sendAlert = useAlert();
    const panelConfig = useSelector((state) => state.panelConfig);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentHostId, setCurrentHostId] = useState(null);

    const deleteHost = async (hostId) => {
        const response = await AxiosDelete(`/container/${params?.panelId}/hosts/${hostId}`);
        if (response) {
            sendAlert(`Deleted host  ${panelConfig.data.hosts[hostId].title}`, { variant: "success" });
        } else {
            sendAlert(`Could not delete host ${panelConfig.data.hosts[hostId].title}`, { variant: "error" });
        }
    };

    const createHost = async (host) => {
        const response = await AxiosPost(`/container/${params?.panelId}/hosts`, host);
        if (response) {
            sendAlert(`Created host ${host.title}`, { variant: "success" });
        } else {
            sendAlert(`Could not create host ${host.title}`, { variant: "error" });
        }
        setCurrentHostId(null);
    };

    const updateHost = async (host, hostId) => {
        setCurrentHostId(null);
        const response = await AxiosPut(`/container/${params?.panelId}/hosts/${hostId}`, host);
        if (response) {
            sendAlert(`Updated host ${host.title}`, { variant: "success" });
        } else {
            sendAlert(`Could not update host ${host.title}`, { variant: "error" });
        }
    };

    const onClickAdd = (hostId) => {
        setCurrentHostId(null);
        setDialogOpen(true);
    };

    const onClickEdit = (hostId) => {
        if (hostId) {
            setCurrentHostId(hostId);
        } else {
            setCurrentHostId(null);
        }
        setDialogOpen(true);
    };

    const onDismiss = () => {
        setDialogOpen(false);
        setCurrentHostId(null);
    };

    const getHostCards = (hosts) => {
        const cards = [];
        for (let hostId in hosts) {
            cards.push(
                <Grid item key={hostId} xl={3} lg={4} md={6} xs={12}>
                    <HostCardEdit
                        handleDelete={deleteHost}
                        handleEdit={onClickEdit}
                        host={hosts[hostId]}
                        hostId={hostId}
                    />
                </Grid>
            );
        }
        return cards;
    };

    if (panelConfig.status === "loading") {
        return <BugLoading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    return (
        <>
            <AddDialog
                hostId={currentHostId}
                defaultData={panelConfig?.data?.hosts[currentHostId]}
                open={dialogOpen}
                onDismiss={onDismiss}
                onCreate={createHost}
                onEdit={updateHost}
            />
            <Grid container alignItems="stretch" spacing={1}>
                {getHostCards(panelConfig.data.hosts)}
                <Grid item key={"addDialog"} xl={3} lg={4} md={6} xs={12}>
                    <AddCard handleClick={onClickAdd} />
                </Grid>
            </Grid>
        </>
    );
}
