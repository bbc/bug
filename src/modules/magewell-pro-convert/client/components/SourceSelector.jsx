import React from "react";
import BugApiAutocomplete from "@core/BugApiAutocomplete";
import { useApiPoller } from "@utils/ApiPoller";
import { useAlert } from "@utils/Snackbar";
import AxiosPost from "@utils/AxiosPost";

export default function SourceSelector({ panelId }) {
    const sendAlert = useAlert();

    const sources = useApiPoller({
        url: `/container/${panelId}/source/list`,
        interval: 5000,
    });

    const currentSource = useApiPoller({
        url: `/container/${panelId}/source/current`,
        interval: 5000,
    });

    const handleSourceChange = async (source) => {
        if (
            source?.label &&
            (await AxiosPost(`/container/${panelId}/source`, {
                name: source?.label,
            }))
        ) {
            sendAlert(`Source changed to ${source.label}`, { variant: "success" });
        } else {
            sendAlert(`Failed to change source`, { variant: "error" });
        }
    };

    console.log(currentSource.data);
    return (
        <>
            <BugApiAutocomplete
                options={sources?.data}
                value={"TEST"}
                onChange={(event, value) => handleSourceChange(value)}
            />
        </>
    );
}
