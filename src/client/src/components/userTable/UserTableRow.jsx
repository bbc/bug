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

export default function LogTableRow(props) {
    const classes = useStyles();
    const sendAlert = useAlert();

    const handleSwitchChange = async (checked, email) => {
        const command = checked ? "enable" : "disable";
        const commandText = checked ? "Enabled" : "Disabled";
        let status;

        if (checked) {
            status = await AxiosCommand(`/api/user/${email}/enable`);
        } else {
            status = await AxiosCommand(`/api/user/${email}/disable`);
        }

        if (status) {
            sendAlert(`${commandText} ${email}`, {
                variant: "success",
            });
        } else {
            sendAlert(`Failed to ${command} ${email}`, {
                variant: "error",
            });
        }
    };

    const getSwitchState = async (state) => {
        let checked = false;
        if (state === "active") {
            checked = true;
        }
        console.log(checked);
        return checked;
    };

    return (
        <TableRow key={props.email}>
            <TableCell className={classes.colName}>
                <ApiSwitch
                    checked={getSwitchState(props?.state)}
                    onChange={(checked) =>
                        handleSwitchChange(checked, props.email)
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
