import React, { useState } from "react";
import { Link } from "react-router-dom";
import AxiosGet from "@utils/AxiosGet";
import useAsyncEffect from "use-async-effect";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import useSounds from "@hooks/Sounds";
import { useTheme } from "@mui/material/styles";

const BugMenuIcon = () => {
    const theme = useTheme();
    const [info, setInfo] = useState();
    const click = useSounds("/sounds/switch-on.mp3");

    useAsyncEffect(async () => {
        setInfo(await AxiosGet(`/api/system/info`));
    }, []);

    return (
        <ListItem button component={Link} onClick={click} to={`/system/about`}>
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
