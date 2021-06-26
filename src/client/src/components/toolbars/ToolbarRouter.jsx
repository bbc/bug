import PageTitle from "@components/PageTitle";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import React from "react";
import { useLocation } from "react-router-dom";
import PanelsToolbar from "@components/toolbars/PanelsToolbar";
import PanelsEditToolbar from "@components/toolbars/PanelsEditToolbar";
import UsersToolbar from "@components/toolbars/UsersToolbar";
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
            return null;
        }

        if (!panelConfig.data) {
            return null;
        }

        if (Toolbars["modules"][panelConfig.data.module]) {
            const Toolbar = Toolbars["modules"][panelConfig.data.module]["client"]["Toolbar"];
            return <Toolbar panelId={panelConfig.data.id} />;
        }

        return null;
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
        case "/panels/config":
            return (
                <>
                    <div className={classes.title}>
                        <PageTitle />
                    </div>
                    <PanelsEditToolbar />
                </>
            );
        case "/configuration/users":
            return (
                <>
                    <div className={classes.title}>
                        <PageTitle />
                    </div>
                    <UsersToolbar />
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
