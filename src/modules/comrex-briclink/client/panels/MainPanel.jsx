import React from "react";
import BugPanelTabbedForm from "@core/BugPanelTabbedForm";
import TabPeers from "./TabPeers";
import TabStatistics from "./TabStatistics";
import TabAudio from "./TabAudio";
import TabProfiles from "./TabProfiles";

export default function MainPanel({ panelId }) {
    return (
        <>
            <BugPanelTabbedForm
                labels={["Connections", "Statistics", "Audio", "Profiles"]}
                locations={[
                    `/panel/${panelId}/display/connections`,
                    `/panel/${panelId}/display/statistics`,
                    `/panel/${panelId}/display/audio`,
                    `/panel/${panelId}/display/profiles`,
                ]}
                content={[
                    <TabPeers panelId={panelId} />,
                    <TabStatistics panelId={panelId} />,
                    <TabAudio panelId={panelId} />,
                    <TabProfiles panelId={panelId} />,
                ]}
                contentProps={{ elevation: 0, sx: { backgroundColor: "red" } }}
            ></BugPanelTabbedForm>
        </>
    );
}
