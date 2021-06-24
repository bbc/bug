import React, { useEffect } from "react";
import UserTable from "@components/users/UserTable";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({}));

export default function PageConfigurationUsers() {
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("User Configuration"));
    }, [dispatch]);

    return (
        <>
            <UserTable />
        </>
    );
}
