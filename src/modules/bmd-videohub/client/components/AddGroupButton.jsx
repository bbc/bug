import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

export default function AddGroupButton({ onClick }) {
    return (
        <Button
            sx={{
                borderRadius: "3px",
                margin: "4px",
                width: "128px",
                height: "48px",
                "@media (max-width:800px)": {
                    height: "36px",
                    width: "92px",
                },
            }}
            variant="outlined"
            color="secondary"
            onClick={onClick}
        >
            <AddIcon />
        </Button>
    );
}
