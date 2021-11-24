import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";

export default function PageSystemAbout() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("About BUG"));
    }, [dispatch]);

    return <>About BUG etc ...</>;
}
