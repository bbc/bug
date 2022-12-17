import React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import AxiosCommand from "@utils/AxiosCommand";
import BugApiSwitch from "@core/BugApiSwitch";
import { useAlert } from "@utils/Snackbar";
import SecurityMenu from "./SecurityMenu";
import { useHistory } from "react-router-dom";

export default function SecurityTableRow({ strategy }) {
    const sendAlert = useAlert();
    const history = useHistory();

    const handleSwitchChange = async (checked, type) => {
        const command = checked ? "enable" : "disable";
        const commandText = checked ? "Enabled" : "Disabled";
        let status;

        if (checked) {
            status = await AxiosCommand(`/api/strategy/${type}/enable`);
        } else {
            status = await AxiosCommand(`/api/strategy/${type}/disable`);
        }

        if (status) {
            sendAlert(`${commandText} ${strategy.name}`, {
                variant: "success",
            });
        } else {
            sendAlert(`Failed to ${command} ${strategy.name}`, {
                variant: "error",
            });
        }
    };

    const handleRowClick = (type) => {
        history.push(`/system/security/${type}`);
    };

    return (
        <TableRow key={strategy.type} hover sx={{ cursor: "pointer" }} onClick={() => handleRowClick(strategy.type)}>
            <TableCell sx={{ width: "82px" }}>
                <BugApiSwitch
                    checked={strategy.enabled}
                    onChange={(checked) => handleSwitchChange(checked, strategy.type)}
                />
            </TableCell>
            <TableCell>{strategy.name}</TableCell>
            <TableCell
                sx={{
                    "@media (max-width:512px)": {
                        display: "none",
                    },
                }}
            >
                {strategy.type.toUpperCase()}
            </TableCell>
            <TableCell
                sx={{
                    "@media (max-width:1024px)": {
                        display: "none",
                    },
                }}
            >
                {strategy.description}
            </TableCell>
            <TableCell sx={{ width: "2rem" }}>
                <SecurityMenu strategy={strategy} />
            </TableCell>
        </TableRow>
    );
}
