import React from "react";
import AxiosGet from "@utils/AxiosGet";
import useAsyncEffect from 'use-async-effect';

export default function BugQuote(props) {
    const [quote, setQuote] = React.useState(null);

    useAsyncEffect(async () => {
        setQuote(await AxiosGet(`/api/bug/quote`));
    }, []);

    return (
        <>
            { quote }
        </>
    );
}
