import React from "react";
import { useParams } from "react-router-dom";
import EncoderTable from "../components/EncoderTable";
import DecoderTable from "../components/DecoderTable";
import SputniksTable from "../components/SputniksTable";
import PanelTabbedForm from "@core/PanelTabbedForm";
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
            <PanelTabbedForm
                className={classes.form}
                labels={["Encoders", "Decoders", "Sputniks"]}
                content={[
                    <EncoderTable panelId={params.panelId} header={false} />,
                    <DecoderTable panelId={params.panelId} header={false} />,
                    <SputniksTable panelId={params.panelId} header={false} />,
                ]}
                locations={[
                    `/panel/${params.panelId}/encoders`,
                    `/panel/${params.panelId}/decoders`,
                    `/panel/${params.panelId}/sputniks`,
                ]}
                defaultTab={1}
            ></PanelTabbedForm>
        </>
    );
}
