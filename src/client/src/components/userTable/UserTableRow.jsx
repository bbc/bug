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
    colUsername: {
        "@media (max-width:1024px)": {
            display: "none",
        },
    },
    colName: {
        "@media (max-width:512px)": {
            display: "none",
        },
    },
    colEmail: {
        "@media (max-width:200px)": {
            display: "none",
        },
    },
}));

export default function UserTableRow(props) {
    const classes = useStyles();
    const sendAlert = useAlert();

    const handleSwitchChange = async (checked, uuid) => {
        const command = checked ? "enable" : "disable";
        const commandText = checked ? "Enabled" : "Disabled";
        let status;

        if (checked) {
            status = await AxiosCommand(`/api/user/${uuid}/enable`);
        } else {
            status = await AxiosCommand(`/api/user/${uuid}/disable`);
        }

        if (status) {
            sendAlert(`${commandText} ${props.firstName} ${props.lastName}`, {
                variant: "success",
            });
        } else {
            sendAlert(
                `Failed to ${command} ${props.firstName} ${props.lastName}`,
                {
                    variant: "error",
                }
            );
        }
    };

    return (
        <TableRow key={props.uuid}>
            <TableCell className={classes.colName}>
                <ApiSwitch
                    checked={props?.enabled}
                    onChange={(checked) =>
                        handleSwitchChange(checked, props.uuid)
                    }
                />
            </TableCell>
            <TableCell className={classes.colName}>
                {`${props?.firstName} ${props?.lastName}`}
            </TableCell>
            <TableCell className={classes.colEmail}>{props.email}</TableCell>
            <TableCell className={classes.colUsername}>
                {props.username}
            </TableCell>
        </TableRow>
    );
}
