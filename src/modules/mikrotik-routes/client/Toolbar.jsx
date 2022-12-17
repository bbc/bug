import React from "react";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
import { useDispatch } from "react-redux";
import panelDataSlice from "@redux/panelDataSlice";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CheckIcon from "@mui/icons-material/Check";

export default function Toolbar({ panelId, ...props }) {
    const toolbarProps = { ...props };
    const [showAll, setShowAll] = React.useState(false);
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(panelDataSlice.actions["update"]({ showAll: showAll }));
    }, [showAll]);

    const handleShowAllClicked = (event) => {
        setShowAll(event.target.checked);
    };

    const buttons = () => (
        <FormGroup>
            <FormControlLabel control={<Switch onClick={handleShowAllClicked} checked={showAll} />} label="Show All" />
        </FormGroup>
    );

    const menuItems = () => {
        return [
            <Divider key="divider1" />,
            <MenuItem key="showadvanced" onClick={() => setShowAll(!showAll)}>
                <ListItemIcon>{showAll ? <CheckIcon fontSize="small" /> : null}</ListItemIcon>
                <ListItemText primary="Show All" />
            </MenuItem>,
        ];
    };

    toolbarProps["buttons"] = buttons();
    toolbarProps["menuItems"] = menuItems();
    toolbarProps["onClick"] = null;
    return <BugToolbarWrapper {...toolbarProps} />;
}
