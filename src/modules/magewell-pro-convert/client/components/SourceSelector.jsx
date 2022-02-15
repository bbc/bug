import React from "react";
import BugApiAutocomplete from "@core/BugApiAutocomplete";
import { useApiPoller } from "@hooks/ApiPoller";
import { useAlert } from "@utils/Snackbar";
import AxiosPost from "@utils/AxiosPost";

export default function SourceSelector({ panelId, currentSource }) {
    const sendAlert = useAlert(panelId);

    const sources = useApiPoller({
        url: `/container/${panelId}/source/list`,
        interval: 10000,
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

    const getSourceId = (label) => {
        for (let source of sources.data) {
            if (source.label === label) {
                return source.id;
            }
        }
    };

    if (currentSource && sources.status === "success") {
        return (
            <>
                <BugApiAutocomplete
                    disableClearable={true}
                    options={sources?.data}
                    value={{ label: currentSource, id: getSourceId(currentSource) }}
                    onChange={(event, value) => handleSourceChange(value)}
                />
            </>
        );
    }
    return <></>;
}
