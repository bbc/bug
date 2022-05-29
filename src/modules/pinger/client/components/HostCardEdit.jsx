import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { Typography, Button, Card, CardContent, CardActionArea, CardActions } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function HostCard({ handleDelete, handleEdit, host, hostId }) {
    const params = useParams();
    const history = useHistory();
    console.log(host);
    const handleClick = (event) => {
        history.push(`/panel/${params.panelId}/host/${hostId}`);
    };

    const handleEditClick = (event) => {
        handleEdit(hostId);
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
                    margin: "4px",
                }}
                variant="outlined"
                color="secondary"
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
