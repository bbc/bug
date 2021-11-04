import React from "react";
import BugApiAutocomplete from "@core/BugApiAutocomplete";
import { useApiPoller } from "@utils/ApiPoller";

export default function SourceSelector({ panelId }) {
    const sources = useApiPoller({
        url: `/container/${panelId}/source/`,
        interval: 5000,
    });

    const handleSourceChange = (source) => {
        console.log(source);
    };

    return (
        <>
            <BugApiAutocomplete
                options={sources}
                value={"test"}
                onChange={(event, value) => handleSourceChange(value)}
            />
        </>
    );
}
