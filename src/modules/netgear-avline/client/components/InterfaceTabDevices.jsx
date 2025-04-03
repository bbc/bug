import BugApiTable from "@core/BugApiTable";
import Box from "@mui/material/Box";
import React from "react";

export default function InterfaceTabDevices({ panelId, interfaceId }) {
    return (
        <BugApiTable
            columns={[
                {
                    title: "MAC Address",
                    width: 160,
                    // hideWidth: 1800,
                    sortable: true,
                    filterType: "text",
                    field: "mac",
                    defaultSortDirection: "asc",
                    content: (item) => {
                        return item["mac"];
                    },
                },
                {
                    title: "Type",
                    width: 200,
                    minWidth: 200,
                    noWrap: true,
                    content: (item) => {
                        return <>{item.entryType}</>;
                    },
                },
                {
                    title: "Address",
                    width: 140,
                    sortable: true,
                    field: "address",
                    defaultSortDirection: "asc",
                    filterType: "text",
                    content: (item) => {
                        return <>{item.address}</>;
                    },
                },
                {
                    title: "Name",
                    noWrap: true,
                    sortable: true,
                    field: "name",
                    defaultSortDirection: "asc",
                    filterType: "text",
                    content: (item) => {
                        return (
                            <>
                                <Box
                                    sx={{
                                        whiteSpace: "nowrap",
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                        color: "#ffffff",
                                        fontFamily: "fontFamily",
                                        fontSize: "0.875rem",
                                        lineHeight: 1.43,
                                        display: "block",
                                        maxWidth: "100%",
                                        textAlign: "left",
                                    }}
                                >
                                    {item.comment ? item.comment : item.hostname}
                                </Box>
                            </>
                        );
                    },
                },
            ]}
            apiUrl={`/container/${panelId}/interface/fdb/${interfaceId}`}
            panelId={panelId}
            defaultSortDirection="asc"
            defaultSortIndex={3}
            hideHeader={false}
            rowHeight="48px"
            sortable
            filterable
        />
    );
}
