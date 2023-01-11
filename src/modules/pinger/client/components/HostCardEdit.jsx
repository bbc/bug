import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { Typography, Button, Card, CardContent, CardActionArea, CardActions } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function HostCard({ panelId, handleDelete, host, hostId }) {
    const params = useParams();
    const history = useHistory();

    const handleClick = (event) => {
        history.push(`/panel/${panelId}/host/${hostId}`);
    };

    const handleEditClick = (event) => {
        history.push(`/panel/${panelId}/host/${hostId}/edit`);
    };

    const handleDeleteClick = (event) => {
        handleDelete(hostId);
    };

    return (
        <>
            <Card
                sx={{
                    borderRadius: "3px",
                    minWidth: 275,
                    height: "100%",
                    margin: "4px",
                }}
                variant="outlined"
                color="background.paper"
            >
                <CardActionArea onClick={handleClick}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {host?.title}
                        </Typography>

                        <Typography variant="body2">{host?.description}</Typography>
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
