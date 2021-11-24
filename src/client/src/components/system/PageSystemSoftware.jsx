import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";

export default function PageSystemSoftware() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("System Software"));
    }, [dispatch]);

    return <>Software updates etc ...</>;
}
