import React, { useEffect } from "react";
import PanelAdd from "@components/PanelAdd";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";

export default function PagePanels() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("Add Panel"));
    });

    return (
        <>
            <PanelAdd />
        </>
    );
}