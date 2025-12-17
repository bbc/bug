import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
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
            }}
            variant="outlined"
        >
            <CardContent sx={{ padding: "13px", paddingBottom: "0px", display: "flex", flexDirection: "column" }}>
                <Typography variant="h5" component="div">
                    {player?.title}
                </Typography>

                <Typography variant="body2" sx={{ height: "20px" }}>
                    {player?.description}
                </Typography>
                <Box sx={{ paddingTop: "8px" }}>
                    <Button onClick={handleEditClick} startIcon={<EditIcon />} size="small" color="primary">
                        Edit
                    </Button>

                    <Button onClick={handleDeleteClick} startIcon={<DeleteIcon />} size="small" color="primary">
                        Delete
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}
