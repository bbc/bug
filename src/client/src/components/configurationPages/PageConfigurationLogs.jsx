import React, { useEffect } from "react";
import LogTable from "@components/logTable/LogTable";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({}));

export default function PageConfigurationUsers() {
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("Logs"));
    }, [dispatch]);

    return (
        <>
            <LogTable level={"action"} />
        </>
    );
}
