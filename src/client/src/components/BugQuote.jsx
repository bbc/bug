import { Box } from "@mui/material";
import AxiosGet from "@utils/AxiosGet";
import React from "react";
import useAsyncEffect from "use-async-effect";
export default function BugQuote(props) {
    const [quote, setQuote] = React.useState(null);

    useAsyncEffect(async () => {
        setQuote(await AxiosGet(`/api/bug/quote`));
    }, []);

    if (!quote) {
        return null;
    }
    return (
        <Box
            sx={{
                margin: "16px",
                color: "primary.main",
                fontSize: "1.1rem",
            }}
        >
            {quote}
        </Box>
    );
}
