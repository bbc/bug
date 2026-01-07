import { faBug } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AxiosGet from "@utils/AxiosGet";
import { useState } from "react";
import { Link } from "react-router-dom";
import useAsyncEffect from "use-async-effect";

const BugMenuIcon = () => {
    const theme = useTheme();
    const [info, setInfo] = useState();

    useAsyncEffect(async () => {
        setInfo(await AxiosGet(`/api/system/info`));
    }, []);

    return (
        <ListItemButton component={Link} to={`/system/about`}>
            <ListItemIcon sx={{ padding: "2px" }}>
                <FontAwesomeIcon color={theme.palette.text.primary} size="lg" icon={faBug} />
            </ListItemIcon>
            <ListItemText
                primary="Bug"
                secondary={info?.version}
                secondaryTypographyProps={{ align: "right", display: "inline" }}
            />
        </ListItemButton>
    );
};

export default BugMenuIcon;
