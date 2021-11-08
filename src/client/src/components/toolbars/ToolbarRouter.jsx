import React from "react";
import PageTitle from "@components/PageTitle";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import PanelsToolbar from "@components/toolbars/PanelsToolbar";
import PanelsEditToolbar from "@components/toolbars/PanelsEditToolbar";
import UsersToolbar from "@components/toolbars/UsersToolbar";
import SecurityToolbar from "@components/toolbars/SecurityToolbar";
import SecurityEditToolbar from "@components/toolbars/SecurityEditToolbar";
import * as Toolbars from "../../../../modules/*/client/Toolbar.jsx";

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
        overflow: "hidden",
    },
}));

const ToolbarRouter = (props) => {
    const classes = useStyles();
    const location = useLocation();

    const panelConfig = useSelector((state) => state.panelConfig);
    if (panelConfig.status === "loading") {
        return null;
    }

    const PanelToolbar = () => {
        if (panelConfig.status !== "success") {
            return <></>;
        }

        if (Toolbars["modules"][panelConfig?.data?.module]) {
            console.log("HERE");
            const Toolbar = Toolbars["modules"][panelConfig.data.module]["client"]["Toolbar"];
            return <Toolbar panelId={panelConfig.data.id} />;
        }

        return <></>;
    };

    switch (location.pathname) {
        case "/panels":
            return (
                <>
                    <div className={classes.title}>
                        <PageTitle />
                    </div>
                    <PanelsToolbar />
                </>
            );
        case "/panels/edit":
            return (
                <>
                    <div className={classes.title}>
                        <PageTitle />
                    </div>
                    <PanelsEditToolbar />
                </>
            );
        case "/system/users":
            return (
                <>
                    <div className={classes.title}>
                        <PageTitle />
                    </div>
                    <UsersToolbar />
                </>
            );
        case "/system/security":
            return (
                <>
                    <div className={classes.title}>
                        <PageTitle />
                    </div>
                    <SecurityToolbar />
                </>
            );
        case "/system/security/edit":
            return (
                <>
                    <div className={classes.title}>
                        <PageTitle />
                    </div>
                    <SecurityEditToolbar />
                </>
            );

        default:
            return (
                <>
                    <div className={classes.title}>
                        <PageTitle />
                    </div>
                    <PanelToolbar />
                </>
            );
    }
};

export default ToolbarRouter;
