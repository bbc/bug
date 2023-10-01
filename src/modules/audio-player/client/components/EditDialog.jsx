import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import BugTextField from "@core/BugTextField";

export default function AddDialog({ opn, item, onDismiss, onConfirm }) {
    const [title, setTitle] = useState(item.title);
    const [description, setDescription] = useState(item.description);
    const [source, setSource] = useState(item.source);

    const handleSubmit = async (event) => {
        onConfirm(event, {
            title,
            description,
            source,
            id: item.id,
        });
    };

    return (
        <Dialog open onClose={onDismiss} style={{ minWidth: "50%" }}>
            <DialogTitle>Edit Player</DialogTitle>
            <DialogContent sx={{ paddingTop: 0 }}>
                <Box sx={{ paddingBottom: "1rem" }}>
                    <BugTextField
                        variant="standard"
                        value={title}
                        onChange={(event) => {
                            setTitle(event.target.value);
                        }}
                        sx={{ width: "20rem" }}
                        name="title"
                        fullWidth
                        label="Title"
                    />
                </Box>
                <Box sx={{ paddingBottom: "1rem" }}>
                    <BugTextField
                        variant="standard"
                        value={description}
                        onChange={(event) => {
                            setDescription(event.target.value);
                        }}
                        sx={{ width: "20rem" }}
                        name="description"
                        fullWidth
                        label="Description"
                    />
                </Box>
                <Box sx={{ paddingBottom: "1rem" }}>
                    <BugTextField
                        variant="standard"
                        value={source}
                        onChange={(event) => {
                            setSource(event.target.value);
                        }}
                        sx={{ width: "20rem" }}
                        name="source"
                        fullWidth
                        label="Source URL"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={onDismiss}>
                    Cancel
                </Button>
                <Button disabled={!title || !source} type="submit" onClick={handleSubmit} color="primary" autoFocus>
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
}
