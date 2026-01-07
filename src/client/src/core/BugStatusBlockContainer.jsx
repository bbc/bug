import BugStatusBlock from "@core/BugStatusBlock";
import { Box } from "@mui/material";
export default function BugStatusBlockContainer({ items, sx = {} }) {
    return (
        <Box
            sx={{
                textAlign: "center",
                ...sx,
            }}
        >
            <Box
                sx={{
                    display: "block",
                    marginBottom: "8px",
                }}
            >
                {items &&
                    items.map((statusItem, index) => (
                        <BugStatusBlock
                            label={statusItem.label}
                            state={statusItem.state}
                            key={index}
                            items={statusItem.items}
                            image={statusItem.image}
                        />
                    ))}
            </Box>
        </Box>
    );
}
