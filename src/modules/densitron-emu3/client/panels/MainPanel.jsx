import React from "react";
import Device from "../components/Device";
import { useParams } from "react-router-dom";
import { useApiPoller } from "@hooks/ApiPoller";
import Loading from "@components/Loading";
import BugPanelTabbedForm from "@core/BugPanelTabbedForm";
import BugNoData from "@core/BugNoData";

export default function MainPanel({ panelId }) {
    const params = useParams();
    const deviceList = useApiPoller({
        url: `/container/${panelId}/device`,
        interval: 20000,
    });

    if (deviceList.status !== "success") {
        return <Loading />;
    }

    if (!deviceList.data) {
        return <BugNoData title="No device data found" panelId={panelId} showConfigButton={true} />;
    }

    const labels = [];
    const content = [];
    const locations = [];

    if (deviceList.data.filter((device) => device.deviceEnabled === 1).length > 1) {
        for (const eachDevice of deviceList.data) {
            if (eachDevice.deviceEnabled === 1) {
                labels.push(eachDevice.deviceName);
                content.push(<Device panelId={params.panelId} deviceIndex={eachDevice.deviceIndex} />);
                locations.push(`/panel/${params.panelId}/${eachDevice.deviceIndex}`);
            }
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

    const enabledDeviceIndex = deviceList.data.find((device) => device.deviceEnabled === 1).deviceIndex;

    return <Device panelId={params.panelId} deviceIndex={enabledDeviceIndex} />;
}
