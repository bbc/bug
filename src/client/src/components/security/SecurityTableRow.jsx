import React from "react";
import { makeStyles } from "@mui/styles";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import AxiosCommand from "@utils/AxiosCommand";
import BugApiSwitch from "@core/BugApiSwitch";
import { useAlert } from "@utils/Snackbar";
import SecurityMenu from "./SecurityMenu";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(async (theme) => ({
    tableRow: {
        cursor: "pointer",
    },
    colState: {
        width: 82,
    },
    colType: {
        "@media (max-width:512px)": {
            display: "none",
        },
    },
    colDescription: {
        "@media (max-width:1024px)": {
            display: "none",
        },
    },
    colNav: {
        width: "1rem",
    },
}));

export default function SecurityTableRow({ strategy }) {
    const classes = useStyles();
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
        <TableRow key={strategy.type} hover className={classes.tableRow} onClick={() => handleRowClick(strategy.type)}>
            <TableCell className={classes.colState}>
                <BugApiSwitch
                    checked={strategy.enabled}
                    onChange={(checked) => handleSwitchChange(checked, strategy.type)}
                />
            </TableCell>
            <TableCell className={classes.colName}>{strategy.name}</TableCell>
            <TableCell className={classes.colType}>{strategy.type.toUpperCase()}</TableCell>
            <TableCell className={classes.colDescription}>{strategy.description}</TableCell>
            <TableCell className={classes.colNav}>
                <SecurityMenu strategy={strategy} />
            </TableCell>
        </TableRow>
    );
}
