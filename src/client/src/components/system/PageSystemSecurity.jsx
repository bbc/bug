import React, { useEffect } from "react";
import SecurityTable from "@components/security/SecurityTable";
import SecurityTableEdit from "@components/security/SecurityTableEdit";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";

export default function PageSystemSecurity({ edit }) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("System Security"));
    }, [dispatch]);

    if (edit) {
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
