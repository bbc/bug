import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import BugSelect from "@core/BugSelect";
import Grid from "@mui/material/Grid";

export default function LatencyDialog({ open, item, onDismiss, onConfirm }) {
    const [latency, setLatency] = React.useState(item?.videoProfile?.latency);

    const handleSubmit = async (event) => {
        onConfirm(event, latency);
    };

    return (
        <Dialog maxWidth="sm" open={open} onClose={onDismiss}>
            <DialogTitle>Latency: {item?.videoProfile?.label}</DialogTitle>
            <DialogContent>
                <Grid container spacing={4} sx={{ width: "24rem", marginTop: "-22px" }}>
                    <Grid item xs={12}>
                        <BugSelect
                            value={latency}
                            options={[
                                { id: "NORMAL", label: "Normal" },
                                { id: "LOW", label: "Low" },
                                { id: "ULL", label: "Ultra Low" },
                            ]}
                            onChange={(event) => setLatency(event.target.value)}
                        ></BugSelect>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onDismiss}>Cancel</Button>
                <Button type="submit" onClick={handleSubmit} color="primary" autoFocus>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
