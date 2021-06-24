import React, { useEffect } from "react";
import SecurityTable from "@components/security/SecurityTable";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({}));

export default function PageConfigurationSecurity(props) {
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("Security Configuration"));
    }, [dispatch]);

    return (
        <>
            <SecurityTable />
        </>
    );
}
