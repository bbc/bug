import React from "react";
import InterfaceList from "../components/InterfaceList";
import { useParams } from "react-router-dom";
import { useApiPoller } from "@hooks/ApiPoller";
import Loading from "@components/Loading";
import BugPanelTabbedForm from "@core/BugPanelTabbedForm";

export default function MainPanel({ panelId }) {
    //TODO params.panelId or panelID? You choose.
    const params = useParams();
    const stackDevices = useApiPoller({
        url: `/container/${panelId}/device/stackcount`,
        interval: 20000,
    });

    if (stackDevices.status !== "success") {
        return <Loading />;
    }

    if (stackDevices.data !== null && stackDevices?.data?.length > 1) {
        const labels = [];
        const content = [];
        const locations = [];
        for (const eachStack of stackDevices.data) {
            labels.push(`Stack ${eachStack}`);
            content.push(<InterfaceList panelId={params.panelId} stackId={eachStack} />);
            locations.push(`/panel/${params.panelId}/${eachStack}`);
        }
        return (
            <>
                <BugPanelTabbedForm
                    // className={classes.form}
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
            <InterfaceList panelId={params.panelId} />
        </>
    );
}
