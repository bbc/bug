import React from "react";
import { useParams } from "react-router-dom";
import HostForm from "./../components/HostForm";

const HostAddPanel = () => {
    const params = useParams();
    return <HostForm panelId={params?.panelId}></HostForm>;
};

export default HostAddPanel;
