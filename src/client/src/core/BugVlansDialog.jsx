import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Switch from "@mui/material/Switch";
import Checkbox from "@mui/material/Checkbox";
import BugScrollbars from "@core/BugScrollbars";

export default function BugVlansDialog({ untaggedVlan, taggedVlans, vlans, onDismiss, onConfirm, sx = {} }) {
    const [localUntaggedVlan, setLocalUntaggedVlan] = React.useState(untaggedVlan);
    const [localTaggedVlans, setLocalTaggedVlans] = React.useState(taggedVlans);

    const handleUntaggedChanged = (event, vlanId) => {
        setLocalUntaggedVlan(vlanId);
    };
    const handleTaggedChanged = (event, vlanId) => {
        if (event.target.checked) {
            setLocalTaggedVlans([...localTaggedVlans, vlanId]);
        } else {
            setLocalTaggedVlans(localTaggedVlans.filter((vlan) => vlan !== vlanId));
        }
    };

    const handleCheckboxChanged = (event) => {
        if (!event.target.checked) {
            setLocalTaggedVlans([]);
        } else {
            setLocalTaggedVlans(vlans.map((vlan) => vlan.id));
        }
    };

    return (
        <Dialog sx={sx} open onClose={onDismiss} maxWidth={false}>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                }}
            >
                <DialogTitle id="alert-dialog-title">Edit VLANs</DialogTitle>
                <Box
                    sx={{
                        height: "80vh",
                        width: "600px",
                        padding: "0 1rem",
                    }}
                >
                    <BugScrollbars>
                        <Box
                            sx={{
                                height: 100,
                                maxHeight: "80%",
                                minHeight: "14rem",
                            }}
                        >
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Untagged</TableCell>
                                        <TableCell
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            Tagged
                                            <Checkbox
                                                sx={{ padding: "4px 12px" }}
                                                checked={localTaggedVlans?.length === vlans?.length}
                                                indeterminate={
                                                    localTaggedVlans?.length !== vlans?.length &&
                                                    localTaggedVlans?.length > 0
                                                }
                                                tabIndex={-1}
                                                disableRipple
                                                onChange={handleCheckboxChanged}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {vlans &&
                                        vlans.map((vlan, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {vlan.id} - {vlan.label}
                                                </TableCell>
                                                <TableCell>
                                                    <Switch
                                                        color="primary"
                                                        onChange={(event) => handleUntaggedChanged(event, vlan.id)}
                                                        checked={localUntaggedVlan === vlan.id}
                                                        disabled={localUntaggedVlan === vlan.id}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Switch
                                                        color="primary"
                                                        onChange={(event) => handleTaggedChanged(event, vlan.id)}
                                                        checked={
                                                            localTaggedVlans.includes(vlan.id) &&
                                                            vlan.id !== localUntaggedVlan
                                                        }
                                                        disabled={localUntaggedVlan === vlan.id}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </BugScrollbars>
                </Box>
                <DialogActions>
                    <Button onClick={onDismiss} color="primary">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        onClick={(event) =>
                            onConfirm(event, {
                                untaggedVlan: localUntaggedVlan,
                                taggedVlans: localTaggedVlans,
                            })
                        }
                        color="primary"
                        autoFocus
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
