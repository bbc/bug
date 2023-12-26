import React from "react";
import BugApiTable from "@core/BugApiTable";
import BugNoData from "@core/BugNoData";

export default function GroupList({ panelId }) {
    return (
        <>
            <BugApiTable
                columns={[
                    {
                        title: "Number",
                        sortable: true,
                        field: "number",
                        defaultSortDirection: "asc",
                        hideWidth: 300,
                        width: 150,
                        content: (item) => {
                            return <>{item?.number}</>;
                        },
                    },
                    {
                        title: "Name",
                        field: "name",
                        defaultSortDirection: "asc",
                        sortable: true,
                        hideWidth: 600,
                        content: (item) => {
                            return <>{item?.name}</>;
                        },
                    },
                    {
                        title: "Channels",
                        sortable: false,
                        hideWidth: 600,
                        width: 130,
                        content: (item) => {
                            return <></>;
                        },
                    },
                ]}
                menuItems={
                    [
                        // {
                        //     title: "Edit",
                        //     icon: <EditIcon fontSize="small" />,
                        //     onClick: handleEditClicked,
                        // },
                        // {
                        //     title: "Delete",
                        //     icon: <DeleteIcon fontSize="small" />,
                        //     onClick: handleDeleteClicked,
                        // },
                    ]
                }
                sortable={true}
                apiUrl={`/container/${panelId}/group`}
                noData={<BugNoData panelId={panelId} title="No groups found" showConfigButton={false} />}
            />
        </>
    );
}
