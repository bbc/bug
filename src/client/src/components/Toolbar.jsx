import PageTitle from "@components/PageTitle";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import React, { Suspense } from "react";
import { useLocation } from "react-router-dom";
import PanelsToolbar from "@components/toolbars/PanelsToolbar";
import PanelsEditToolbar from "@components/toolbars/PanelsEditToolbar";

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
        overflow: "hidden",
    },
}));

const Toolbar = (props) => {
    const classes = useStyles();
    const location = useLocation();

    const panelConfig = useSelector((state) => state.panelConfig);
    if (panelConfig.status === "loading") {
        return null;
    }

    const LazyToolbar = () => {
        if (panelConfig.status !== "success") {
            return null;
        }

        if (!panelConfig.data) {
            return null;
        }
        const Toolbar = React.lazy(() =>
            import(`@modules/${panelConfig.data.module}/client/Toolbar`).catch(() =>
                console.log(`Error importing '@modules/${panelConfig.data.module}/client/Toolbar.jsx`)
            )
        );

        return (
            <Suspense fallback={<></>}>
                <Toolbar panelId={panelConfig.data.id} />
            </Suspense>
        );
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
        default:
            return (
                <>
                    <div className={classes.title}>
                        <PageTitle />
                    </div>
                    <LazyToolbar />
                </>
            );
    }
};

export default Toolbar;
