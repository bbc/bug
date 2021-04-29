import React from "react";
import Interface from '../components/Interface';
import { useParams } from "react-router-dom";

export default function InterfacePanel() {
    const params = useParams();

    return (
        <>
            <Interface panelId={params.panelId} interfaceId={params.interfaceId}/>
        </>
    );
}
