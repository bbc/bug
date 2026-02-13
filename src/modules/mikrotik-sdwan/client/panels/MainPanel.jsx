import BugPanelTabbedForm from "@core/BugPanelTabbedForm";
import { Box } from "@mui/material";
import EntryList from "../components/EntryList";
import RouteList from "../components/RouteList";

export default function MainPanel({ panelId }) {
    return (
        <Box>
            <BugPanelTabbedForm
                labels={["SDWAN Entries", "Default Routes"]}
                content={[<EntryList panelId={panelId} />, <RouteList panelId={panelId} />]}
                locations={[`/panel/${panelId}/entries`, `/panel/${panelId}/routes`]}
                defaultTab={0}
                sx={{
                    "& > div > .MuiPaper-root > div": {
                        backgroundColor: "background.default",
                    },
                }}
            />
        </Box>
    );
}
