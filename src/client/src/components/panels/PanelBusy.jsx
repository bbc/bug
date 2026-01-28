import { Box, CircularProgress, Stack } from "@mui/material";

export default function PanelBusy({ message = "Please wait ..." }) {
    return (
        <>
            <Stack
                spacing={0}
                sx={{
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box
                    sx={{
                        fontWeight: 500,
                        margin: 4,
                    }}
                >
                    {message}
                </Box>
                <CircularProgress size={`6rem`} />
            </Stack>
        </>
    );
}
