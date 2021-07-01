import React, { useEffect } from "react";
import SecurityTable from "@components/security/SecurityTable";
import SecurityTableEdit from "@components/security/SecurityTableEdit";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({}));

export default function PageSystemSecurity(props) {
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("System Security"));
    }, [dispatch]);

    if (props.edit) {
        return (
            <>
                <SecurityTableEdit />
            </>
        );
    }
    return (
        <>
            <SecurityTable />
        </>
    );
}
