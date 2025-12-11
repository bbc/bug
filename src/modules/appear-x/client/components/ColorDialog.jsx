import BugSelect from "@core/BugSelect";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import React from "react";

export default function ColorDialog({ open, item, onDismiss, onConfirm }) {
    const [chromaSampling, setChromaSampling] = React.useState(item?.videoProfile?.chromaSampling);
    const [bitDepth, setBitDepth] = React.useState(item?.videoProfile?.bitDepth);

    const handleSubmit = async (event) => {
        onConfirm(event, { chromaSampling, bitDepth });
    };

    return (
        <Dialog maxWidth="sm" open={open} onClose={onDismiss}>
            <DialogTitle>Color Depth: {item?.videoProfile?.label}</DialogTitle>
            <DialogContent>
                <Grid container spacing={4} sx={{ width: "24rem", marginTop: "-22px" }}>
                    <Grid item size={{ xs: 12 }}>
                        <BugSelect
                            label="Bit Depth"
                            value={bitDepth}
                            options={[
                                { id: "8", label: "8 bit" },
                                { id: "10", label: "10 bit" },
                            ]}
                            onChange={(event) => setBitDepth(event.target.value)}
                        ></BugSelect>
                    </Grid>
                    <Grid item size={{ xs: 12 }}>
                        <BugSelect
                            label="Chroma Sampling"
                            value={chromaSampling}
                            options={[
                                { id: "CS_420", label: "4:2:0" },
                                { id: "CS_422", label: "4:2:2" },
                            ]}
                            onChange={(event) => setChromaSampling(event.target.value)}
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
