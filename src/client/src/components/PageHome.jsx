import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import HomeTitle from './HomeTitle';
import HomeTiles from './HomeTiles';
// import ReduxList from './ReduxList';

const useStyles = makeStyles({
    root: {
    },
});

export default function PageHome() {
    
    const classes = useStyles();

    return (
        <>
        <HomeTitle />
        <HomeTiles />
        {/* <ReduxList /> */}
        </>
    );
}

