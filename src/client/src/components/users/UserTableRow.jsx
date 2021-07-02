import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import AxiosCommand from "@utils/AxiosCommand";
import ApiSwitch from "@core/ApiSwitch";
import { useAlert } from "@utils/Snackbar";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { Redirect } from "react-router";

const useStyles = makeStyles((theme) => ({
    tableRow: {
        cursor: "pointer",
    },
    colState: {
        width: "1rem",
    },
    colEmail: {
        "@media (max-width:800px)": {
            display: "none",
        },
    },
    colNav: {
        width: "1rem",
    },
}));

export default function UserTableRow({ user, currentUserId }) {
    const classes = useStyles();
    const sendAlert = useAlert();
    const [redirectUrl, setRedirectUrl] = React.useState(null);

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
            sendAlert(`${commandText} ${user.username}`, {
                variant: "success",
            });
        } else {
            sendAlert(`Failed to ${command} ${user.username}`, {
                variant: "error",
            });
        }
    };

    if (redirectUrl) {
        return <Redirect push to={{ pathname: redirectUrl }} />;
    }

    return (
        <TableRow
            key={user.id}
            hover
            className={classes.tableRow}
            onClick={() => setRedirectUrl(`/system/user/${user.id}`)}
        >
            <TableCell className={classes.colName}>
                <ApiSwitch checked={user.enabled} onChange={(checked) => handleSwitchChange(checked, user.id)} disabled={user.enabled && (user.id === currentUserId)}/>
            </TableCell>
            <TableCell className={classes.colUsername}>{user.username}</TableCell>
            <TableCell className={classes.colName}>{user.name}</TableCell>
            <TableCell className={classes.colEmail}>{user.email}</TableCell>
            <TableCell className={classes.colNav}>
                <ChevronRightIcon />
            </TableCell>
        </TableRow>
    );
}
