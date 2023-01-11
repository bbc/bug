import React from "react";
import { Typography, Button, Card, CardContent, CardActionArea, CardActions } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function PlayerCardEdit({ handleDelete, handleEdit, player, playerId }) {
    const handleEditClick = (event) => {
        handleEdit(playerId);
    };

    const handleDeleteClick = (event) => {
        handleDelete(playerId);
    };

    return (
        <>
            <Card
                sx={{
                    borderRadius: "3px",
                    minWidth: 275,
                    margin: "4px",
                }}
                variant="outlined"
            >
                <CardActionArea>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {player?.title}
                        </Typography>

                        <Typography variant="body2">{player?.description}</Typography>
                    </CardContent>
                </CardActionArea>

                <CardActions>
                    <Button onClick={handleEditClick} startIcon={<EditIcon />} size="small" color="primary">
                        Edit
                    </Button>

                    <Button onClick={handleDeleteClick} startIcon={<DeleteIcon />} size="small" color="primary">
                        Delete
                    </Button>
                </CardActions>
            </Card>
        </>
    );
}
