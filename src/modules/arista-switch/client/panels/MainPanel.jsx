import BugLoading from "@core/BugLoading";
import BugPanelTabbedForm from "@core/BugPanelTabbedForm";
import { useApiPoller } from "@hooks/ApiPoller";
import InterfaceList from "../components/InterfaceList";

export default function MainPanel({ panelId }) {
    const stackDevices = useApiPoller({
        url: `/container/${panelId}/device/stackcount`,
        interval: 20000,
    });

    if (stackDevices.status !== "success") {
        return <BugLoading />;
    }

    if (stackDevices.data !== null && stackDevices?.data?.length > 1) {
        const labels = [];
        const content = [];
        const locations = [];
        for (const eachStack of stackDevices.data) {
            labels.push(`Stack ${eachStack}`);
            content.push(<InterfaceList panelId={panelId} stackId={eachStack} />);
            locations.push(`/panel/${panelId}/${eachStack}`);
        }
        return (
            <>
                <BugPanelTabbedForm
                    labels={labels}
                    content={content}
                    locations={locations}
                    defaultTab={0}
                ></BugPanelTabbedForm>
            </>
        );
    }

    // just a single page
    return (
        <>
            <InterfaceList panelId={panelId} />
        </>
    );
}
