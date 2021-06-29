import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";

const useStyles = makeStyles((theme) => ({}));

export default function PageSystemConfiguration() {
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("System Configuration"));
    }, [dispatch]);

    return <>Configuration</>;
}
