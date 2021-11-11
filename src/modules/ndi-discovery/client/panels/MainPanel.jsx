import React from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import SourcesTable from "./../components/SourcesTable";

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

    return <SourcesTable panelId={params.panelId} />;
}
