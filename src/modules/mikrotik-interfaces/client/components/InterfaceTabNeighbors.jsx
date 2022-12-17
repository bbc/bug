import React from "react";
import BugApiTable from "@core/BugApiTable";

export default function InterfaceTabNeighbors({ panelId, interfaceName }) {
    return (
        <BugApiTable
            columns={[
                {
                    title: "Identity",
                    width: "11rem",
                    content: (item) => item.identity,
                },
                {
                    title: "Platform",
                    hideWidth: 480,
                    content: (item) => item["platform"],
                },
                {
                    title: "MAC Address",
                    width: 160,
                    hideWidth: 1120,
                    content: (item) => item["mac-address"],
                },
                {
                    title: "Address",
                    width: 140,
                    content: (item) => item?.address,
                },
                {
                    title: "Remote Interface",
                    hideWidth: 600,
                    content: (item) => item?.["interface-name"],
                },
            ]}
            apiUrl={`/container/${panelId}/interface/lldp/${interfaceName}`}
            panelId={panelId}
            hideHeader={false}
            rowHeight="48px"
        />
    );
}
