import React, { useEffect } from "react";
import LogTable from "@components/logs/LogTable";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({}));

export default function PageSystemLogs() {
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("System Logs"));
    }, [dispatch]);

    return (
        <>
            <LogTable level={"action"} />
        </>
    );
}
