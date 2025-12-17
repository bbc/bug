import AddIcon from "@mui/icons-material/Add";
import { Card, IconButton } from "@mui/material";
export default function BugDetailsCard({ width, sx = {}, onAdd, ...props }) {
    return (
        <Card
            sx={{
                minWidth: 300,
                textAlign: "center",
                color: "text.secondary",
                position: "relative",
                marginBottom: "8px",
                padding: "8px",
                ...sx,
            }}
            {...props}
        >
            <IconButton onClick={onAdd}>
                <AddIcon />
            </IconButton>
        </Card>
    );
}
