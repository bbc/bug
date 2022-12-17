import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";
import UserEdit from "@components/users/UserEdit";

export default function PageSystemUserEdit() {
    const params = useParams();
    const userId = params.userId ?? null;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("User Configuration"));
    }, [dispatch]);

    return (
        <>
            <UserEdit userId={userId} />
        </>
    );
}
