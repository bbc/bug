import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import AxiosCommand from "@utils/AxiosCommand";
import ApiSwitch from "@core/ApiSwitch";
import { useAlert } from "@utils/Snackbar";

const useStyles = makeStyles((theme) => ({
    colState: {
        "@media (max-width:512px)": {
            display: "none",
        },
    },
    colName: {
        "@media (max-width:512px)": {
            display: "none",
        },
    },
    colType: {
        "@media (max-width:512px)": {
            display: "none",
        },
    },
}));

export default function SecurityTableRow(props) {
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
            sendAlert(`${commandText} ${props.name}`, {
                variant: "success",
            });
        } else {
            sendAlert(`Failed to ${command} ${props.name}`, {
                variant: "error",
            });
        }
    };

    return (
        <TableRow key={props.type}>
            <TableCell className={classes.colName}>
                <ApiSwitch
                    checked={props?.enabled}
                    onChange={(checked) =>
                        handleSwitchChange(checked, props.type)
                    }
                />
            </TableCell>
            <TableCell className={classes.colName}>{props.name}</TableCell>

            <TableCell className={classes.colType}>
                {props.type.toUpperCase()}
            </TableCell>
        </TableRow>
    );
}
