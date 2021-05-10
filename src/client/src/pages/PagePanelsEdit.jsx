import React, { useEffect } from "react";
import PanelTableEditable from "@components/panelTableEditable/PanelTableEditable";
import { useDispatch } from "react-redux";
import pageTitleSlice from "../redux/pageTitleSlice";

export default function PagePanels() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("Panels"));
    });

    return (
        <>
            <PanelTableEditable />
        </>
    );
}
