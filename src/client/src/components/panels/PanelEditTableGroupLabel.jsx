import BugTextField from "@core/BugTextField";
import { TableCell, TableRow } from "@mui/material";

export default function PanelEditTableGroupLabel({ group, onChange, placeholder, id, passedKey }) {
    return (
        <TableRow
            hover
            key={passedKey}
            sx={{
                height: "48px",
                cursor: "move",
                backgroundColor: "background.default",
            }}
        >
            <TableCell colSpan={6}>
                <BugTextField
                    sx={{
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "primary.main",
                        "& .MuiInputBase-input": {
                            textTransform: "uppercase",
                            padding: "12px",
                        },
                    }}
                    fullWidth
                    style={{ width: "26rem" }}
                    value={group}
                    filter={(char) => char.replace(":", "")}
                    onChange={(e) => onChange(group, e.target.value)}
                    placeholder={placeholder}
                    type="text"
                    variant="outlined"
                ></BugTextField>
            </TableCell>
        </TableRow>
    );
}
