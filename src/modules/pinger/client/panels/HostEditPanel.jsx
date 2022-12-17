import React from "react";
import { useParams } from "react-router-dom";
import HostForm from "./../components/HostForm";

const HostEditPanel = () => {
    const params = useParams();
    return <HostForm panelId={params?.panelId} hostId={params?.hostId}></HostForm>;
};

export default HostEditPanel;
