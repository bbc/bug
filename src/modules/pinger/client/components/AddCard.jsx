import AddIcon from "@mui/icons-material/Add";
import { Card, CardActionArea, CardContent, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
export default function AddCard({ panelId }) {
    const navigate = useNavigate();

    const handleAddClick = () => {
        navigate(`/panel/${panelId}/host/add`);
    };
    return (
        <>
            <Card
                onClick={handleAddClick}
                sx={{
                    borderStyle: "dashed",
                    borderRadius: "3px",
                    minWidth: 275,
                    height: "100%",
                    margin: "4px",
                }}
                variant="outlined"
                color="secondary"
            >
                <CardActionArea>
                    <CardContent sx={{ alignItems: "center" }}>
                        <Stack direction="row" alignItems="center" gap={1}>
                            <AddIcon fontSize={"large"} />
                        </Stack>
                    </CardContent>
                </CardActionArea>
            </Card>
        </>
    );
}
