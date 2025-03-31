import { faBug } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";
import AxiosGet from "@utils/AxiosGet";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAsyncEffect from "use-async-effect";

const BugMenuIcon = () => {
    const theme = useTheme();
    const [info, setInfo] = useState();

    useAsyncEffect(async () => {
        setInfo(await AxiosGet(`/api/system/info`));
    }, []);

    return (
        <ListItem button component={Link} to={`/system/about`}>
            <ListItemIcon sx={{ padding: "2px" }}>
                <FontAwesomeIcon color={theme.palette.text.primary} size="lg" icon={faBug} />
            </ListItemIcon>
            <ListItemText
                primary="Bug"
                secondary={info?.version}
                secondaryTypographyProps={{ align: "right", display: "inline" }}
            />
        </ListItem>
    );
};

export default BugMenuIcon;
