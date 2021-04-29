import PageTitle from "@components/PageTitle";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import React, { Suspense  } from "react";

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
        overflow: 'hidden'
    },
}));

const Toolbar = (props) => {
    const classes = useStyles();
    // we rely on PagePanel to fetch the panel object and put it in redux
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
                <Toolbar panel={panel}/>
            </Suspense>
        );
    };

    return (
        <>
            <div className={classes.title}>
                <PageTitle />
            </div>
            <LazyToolbar/>
        </>
    );
};

export default Toolbar;
