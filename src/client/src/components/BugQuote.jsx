import React from "react";
import AxiosGet from "@utils/AxiosGet";
import useAsyncEffect from "use-async-effect";
import Box from "@mui/material/Box";

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
                margin: 2,
                color: "primary.main",
                fontSize: "1.1rem",
            }}
        >
            {quote}
        </Box>
    );
}
