import React from "react";
import PanelList from "@components/PanelList";
import { useDispatch } from 'react-redux';
import pageTitleSlice from '../redux/pageTitleSlice';

export default function PagePanels() {

    const dispatch = useDispatch()
    dispatch(pageTitleSlice.actions.set("Panel List"));

    return (
        <>  
            <PanelList />
        </>
    );
}
