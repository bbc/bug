import React, { useEffect } from "react";
import PanelTable from "@components/panels/PanelTable";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";

export default function PagePanels() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("Panels"));
    });

    return (
        <>
            <PanelTable />
        </>
    );
}
