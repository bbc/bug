import BugToolbarWrapper from "@core/BugToolbarWrapper";
import CheckIcon from "@mui/icons-material/Check";
import { Divider, FormControlLabel, FormGroup, ListItemIcon, ListItemText, MenuItem, Switch } from "@mui/material";
import panelDataSlice from "@redux/panelDataSlice";
import React from "react";
import { useDispatch } from "react-redux";

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
