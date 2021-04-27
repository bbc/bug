import React from "react";
import PanelToolbar from "@core/PanelToolbar";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AirplanemodeActiveIcon from '@material-ui/icons/AirplanemodeActive';
import AlbumIcon from '@material-ui/icons/Album';

export default function Toolbar(props) {

    let toolbarProps = {...props};

    const buttons = () => (
        <Button variant="outlined" color="primary" startIcon={<AirplanemodeActiveIcon />} onClick={() => { alert("TAKEOFF!!!") }}>
            Fly Plane
        </Button>
    )

    const menuItems = () => (
        <MenuItem onClick={() => { alert("I love the Spice Girls!") }}> 
            <ListItemIcon>
                <AlbumIcon />
            </ListItemIcon>
            <ListItemText primary="Play Album" />
        </MenuItem>
    )

    toolbarProps['buttons'] = buttons();
    toolbarProps['menuItems'] = menuItems();
    toolbarProps['onClick'] = null;
    return <PanelToolbar {...toolbarProps} isClosed={false}/>;
}
