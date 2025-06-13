import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

export default function EditButtonsItem({ button, onRemove }) {
    return (
        <ListItem
            sx={{
                borderBottom: "1px solid #282828",
                height: "51px",
                cursor: "move",
                paddingLeft: "8px",
                paddingRight: "8px",
            }}
            key={button.index}
            role="listitem"
            button
        >
            <Box
                sx={{
                    paddingRight: "8px",
                    fontSize: "17px",
                    marginTop: "1px",
                    fontWeight: 900,
                    opacity: 0.3,
                }}
            >
                {button.index + 1}
            </Box>
            <ListItemText
                primary={button.label}
                sx={{
                    opacity: button.hidden ? 0.3 : 1,
                }}
            />
            <IconButton onClick={() => onRemove(button.index)} sx={{ opacity: 0.7 }}>
                <CloseIcon />
            </IconButton>
        </ListItem>
    );
}
