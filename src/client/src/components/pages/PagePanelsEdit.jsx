import React, { useEffect } from "react";
import PanelEditTable from "@components/panels/PanelEditTable";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";

export default function PagePanels() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("Edit Panels"));
    });

    return (
        <>
            <PanelEditTable />
        </>
    );
}
