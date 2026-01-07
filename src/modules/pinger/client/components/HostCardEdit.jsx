import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Card, CardActionArea, CardActions, CardContent, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

export default function HostCard({ panelId, handleDelete, host, hostId }) {
    const params = useParams();
    const navigate = useNavigate();

    const handleClick = (event) => {
        navigate(`/panel/${panelId}/host/${hostId}`);
    };

    const handleEditClick = (event) => {
        navigate(`/panel/${panelId}/host/${hostId}/edit`);
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
