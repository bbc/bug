import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import AxiosCommand from "@utils/AxiosCommand";
import ApiSwitch from "@core/ApiSwitch";
import { useAlert } from "@utils/Snackbar";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SecurityMenu from "./SecurityMenu";

const useStyles = makeStyles((theme) => ({
    tableRow: {
        cursor: "pointer",
    },
    colState: {
        width: "1rem",
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

export default function SecurityTableRow({ strategy, index, isFirst, isLast }) {
    const classes = useStyles();
    const sendAlert = useAlert();

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

    return (
        <TableRow key={strategy.type} hover className={classes.tableRow}>
            <TableCell className={classes.colState}>
                <ApiSwitch
                    checked={strategy.enabled}
                    onChange={(checked) => handleSwitchChange(checked, strategy.type)}
                />
            </TableCell>
            <TableCell className={classes.colName}>{strategy.name}</TableCell>
            <TableCell className={classes.colType}>{strategy.type.toUpperCase()}</TableCell>
            <TableCell className={classes.colDescription}>{strategy.description}</TableCell>
            <TableCell className={classes.colNav}>
                <SecurityMenu strategy={strategy} isFirst={isFirst} isLast={isLast} index={index} />
            </TableCell>
        </TableRow>
    );
}
