import React from "react";
import { useAlert } from "@utils/Snackbar";
import BugApiTable from "@core/BugApiTable";
import BugTableNoData from "@core/BugTableNoData";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useHistory } from "react-router-dom";

export default function InterfaceList({ panelId }) {
    const sendAlert = useAlert();
    const history = useHistory();

    const handleGotoClicked = (event, item) => {
        window.open(`http://${item?.address}`);
    };

    return (
        <BugApiTable
            columns={[
                {
                    sortable: "true",
                    title: "Name",
                    width: "30rem",
                    field: "name",
                    hideWidth: 400,
                    content: (item) => item["name"],
                },
                {
                    sortable: "true",
                    title: "IP Address",
                    width: "10rem",
                    field: "address",
                    hideWidth: 600,
                    content: (item) => item["address"],
                },
                {
                    sortable: "true",
                    title: "Port",
                    width: "10rem",
                    field: "port",
                    hideWidth: 800,
                    content: (item) => item["port"],
                },
            ]}
            menuItems={[
                {
                    title: "Goto Webpage",
                    icon: <OpenInNewIcon fontSize="small" />,
                    onClick: handleGotoClicked,
                },
            ]}
            apiUrl={`/container/${panelId}/source/list`}
            panelId={panelId}
            hideHeader={false}
            noData={
                <BugTableNoData
                    panelId={panelId}
                    title="No NDI Sources found"
                    message="Click to change the discovery server address."
                    showConfigButton={true}
                />
            }
            rowHeight="62px"
            sortable
        />
    );
}
