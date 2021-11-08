import React from "react";
import { useParams } from "react-router-dom";
import DeviceTab from "./../components/DeviceTab";
import NetworkTab from "./../components/NetworkTab";
import BugPanelTabbedForm from "@core/BugPanelTabbedForm";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    form: {
        "& .tabSpacer": {
            height: 60,
        },
    },
}));

export default function MainPanel() {
    const classes = useStyles();
    const params = useParams();

    return (
        <>
            <BugPanelTabbedForm
                className={classes.form}
                labels={["Device", "Network"]}
                content={[
                    <DeviceTab panelId={params.panelId} header={false} />,
                    <NetworkTab panelId={params.panelId} header={false} />,
                ]}
                locations={[`/panel/${params.panelId}/device`, `/panel/${params.panelId}/network`]}
                defaultTab={0}
            ></BugPanelTabbedForm>
        </>
    );
}
