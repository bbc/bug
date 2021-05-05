import React from "react";
import LogTable from "@components/logTable/LogTable";

export default function TabPanelLogs(props) {
    return (
        <>
           <LogTable level={'info'}/>
        </>
    );
}