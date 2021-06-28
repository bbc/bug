import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({}));

export default function PageSystemInfo() {
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("System Information"));
    }, [dispatch]);

    return <>System Info ...</>;
}
