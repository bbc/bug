import React from "react";
import { useParams } from "react-router-dom";
import CueList from "../components/CueList";
import GroupList from "../components/GroupList";
import PlaybackList from "../components/PlaybackList";
import BugPanelTabbedForm from "@core/BugPanelTabbedForm";
import Box from "@mui/material/Box";

export default function MainPanel() {
    const params = useParams();

    return (
        <Box>
            <BugPanelTabbedForm
                labels={["Console", "Cue List", "Groups"]}
                content={[
                    <PlaybackList panelId={params.panelId} />,
                    <CueList panelId={params.panelId} />,
                    <GroupList panelId={params.panelId} />,
                ]}
                locations={[
                    `/panel/${params.panelId}/display/console`,
                    `/panel/${params.panelId}/display/cuelist`,
                    `/panel/${params.panelId}/display/grouplist`,
                ]}
                defaultTab={0}
            ></BugPanelTabbedForm>
        </Box>
    );
}
