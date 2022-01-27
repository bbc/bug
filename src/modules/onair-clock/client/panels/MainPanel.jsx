import React from "react";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import BugTableLinkButton from "@core/BugTableLinkButton";
import { useAlert } from "@utils/Snackbar";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import AxiosPut from "@utils/AxiosPut";
import BugDetailsTable from "@core/BugDetailsTable";
import { useSelector } from "react-redux";
import Loading from "@components/Loading";
import BugNoData from "@core/BugNoData";

export default function MainPanel() {
    const params = useParams();
    const panelConfig = useSelector((state) => state.panelConfig);

    const sendAlert = useAlert();
    const { renameDialog } = useBugRenameDialog();

    if (panelConfig.status === "idle" || panelConfig.status === "loading") {
        return <Loading height="30vh" />;
    }
    if (panelConfig.status !== "success" || !panelConfig.data || !panelConfig.data) {
        return <BugNoData panelId={panelId} title="No device information found" showConfigButton={false} />;
    }

    const handleRenameClicked = async (event, currentHeader) => {
        const result = await renameDialog({
            title: "Main Title",
            defaultValue: currentHeader,
        });

        if (result === false) {
            return false;
        }

        if (await AxiosPut(`/api/panelconfig/${params?.panelId}`, { header: result })) {
            sendAlert(`Successfully renamed device`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to change clock title.`, { variant: "error" });
        }

        event.stopPropagation();
        event.preventDefault();
    };

    return (
        <>
            <Grid item xs={12}>
                <BugDetailsTable
                    data={[
                        {
                            name: "Name",
                            value: (
                                <BugTableLinkButton
                                    onClick={(event) => handleRenameClicked(event, panelConfig.data?.header)}
                                >
                                    {panelConfig.data?.header}
                                </BugTableLinkButton>
                            ),
                        },
                        {
                            name: "Time Zone",
                            value: "GMT",
                        },
                    ]}
                />
            </Grid>
        </>
    );
}
