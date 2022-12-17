import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";
import SecurityStrategy from "@components/security/SecurityStrategy";

export default function PageSystemSecurityStrategy() {
    const params = useParams();
    const type = params.type ?? null;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("Security Configuration"));
    }, [dispatch]);

    return (
        <>
            <SecurityStrategy type={type} />
        </>
    );
}
