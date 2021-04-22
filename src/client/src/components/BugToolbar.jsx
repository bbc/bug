import PageTitle from "@components/PageTitle";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import React, { Suspense, useState, useEffect } from "react";
import { Hidden } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
        overflow: 'hidden'
    },
}));

const BugToolbar = (props) => {
    const classes = useStyles();
    const panel = useSelector((state) => state.panel);

    const LazyToolbar = () => {
        if (!panel) {
            return <></>;
        }
        const Toolbar = React.lazy(() =>
            import(`@modules/${panel.module}/client/Toolbar`).catch(() =>
                console.log(`Error importing '@modules/${panel.module}/client/Toolbar.jsx`)
            )
        );

        return (
            <Suspense fallback={<></>}>
                <Toolbar />
            </Suspense>
        );
    };

    return (
        <>
            <div className={classes.title}>
                <PageTitle />
            </div>
            <LazyToolbar />
        </>
    );
};

export default BugToolbar;
