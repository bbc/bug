import React, { useEffect } from "react";
import PanelSort from "@components/panels/PanelSort";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";

export default function PagePanelsEdit() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("Panels"));
    });

    return (
        <>
            <PanelSort />
        </>
    );
}