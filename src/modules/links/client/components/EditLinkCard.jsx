import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { Typography, Button, Card, CardContent, CardActionArea, CardActions } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function LinkCard({ handleDelete, handleEdit, link, index }) {
    const params = useParams();
    const history = useHistory();

    const handleClick = (event) => {
        if (link?.behaviour === "new") {
            window.open(link?.url);
        }
        if (link?.behaviour === "same") {
            window.open(link?.url, "_self");
        }
        if (link?.behaviour === "inside") {
            history.push(`/panel/${params.panelId}/link/${link?.index}`);
        }
    };

    const handleEditClick = (event) => {
        handleEdit(index);
    };

    const handleDeleteClick = (event) => {
        handleDelete(index);
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
                            {link?.title}
                        </Typography>

                        <Typography variant="body2">{link?.description}</Typography>
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
