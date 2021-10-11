import React from "react";
import { useParams } from "react-router-dom";
import EncoderTable from "../components/encoders/EncoderTable";
import DecoderTable from "../components/decoders/DecoderTable";
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
                labels={["Encoders", "Decoders"]}
                content={[
                    <EncoderTable panelId={params.panelId} header={false} />,
                    <DecoderTable panelId={params.panelId} header={false} />,
                ]}
            ></PanelTabbedForm>
        </>
    );
}
