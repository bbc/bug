import React, { useEffect } from "react";
import UserTable from "@components/users/UserTable";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";

export default function PageSystemUsers() {
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
