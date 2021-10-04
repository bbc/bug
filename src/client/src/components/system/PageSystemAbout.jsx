import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";
// import { makeStyles } from "@mui/styles";

// const useStyles = makeStyles((theme) => ({}));

export default function PageSystemAbout() {
    // const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("About BUG"));
    }, [dispatch]);

    return <>About BUG etc ...</>;
}
