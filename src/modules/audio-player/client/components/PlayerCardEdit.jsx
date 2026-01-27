import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
export default function PlayerCardEdit({ handleDelete, handleEdit, player, playerId }) {
    const handleEditClick = (event) => {
        handleEdit(playerId);
    };

    const handleDeleteClick = (event) => {
        handleDelete(playerId);
    };

    return (
        <Card
            sx={{
                height: "7rem",
                borderRadius: "3px",
                minWidth: 275,
                margin: "4px",
                display: "flex",
            }}
            variant="outlined"
        >
            <CardContent sx={{ padding: 0.5, position: "relative", width: "100%", height: "100%" }}>
                <Grid
                    sx={{ padding: "6px 16px", top: 0, left: 0, width: "100%", height: "100%", position: "absolute" }}
                >
                    <Grid sx={{ display: "flex", alignItems: "center", height: 64 }}>
                        <Grid sx={{ flexGrow: 1 }}>
                            <Typography variant="h5">{player.title}</Typography>
                            <Typography variant="body2" sx={{ height: "1rem" }}>
                                {player.description}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Box sx={{ textAlign: "right" }}>
                        <Button onClick={handleEditClick} startIcon={<EditIcon />} size="small" color="primary">
                            Edit
                        </Button>

                        <Button onClick={handleDeleteClick} startIcon={<DeleteIcon />} size="small" color="primary">
                            Delete
                        </Button>
                    </Box>
                </Grid>
            </CardContent>
        </Card>
    );
}
