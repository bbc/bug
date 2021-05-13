import React from "react";
import PanelTabbedForm from "@core/PanelTabbedForm";
import { Redirect } from "react-router";
import InterfaceTabDetails from "./InterfaceTabDetails";
import InterfaceTabEthernet from "./InterfaceTabEthernet";
import InterfaceTabStatistics from "./InterfaceTabStatistics";
import InterfaceTabHardware from "./InterfaceTabHardware";
import Loading from "@components/Loading";
import { useApiPoller } from "@utils/ApiPoller";

export default function Interface({ panelId, interfaceName }) {
    const [redirectUrl, setRedirectUrl] = React.useState(null);

    const handleBackClicked = () => {
        setRedirectUrl(`/panel/${panelId}`);
    };

    const iface = useApiPoller({
        url: `/container/${panelId}/interface/${interfaceName}`,
        interval: 2000,
    });

    if (iface.status === "idle" || iface.status === "loading") {
        return <Loading height="30vh"/>;
    }
    if (iface.status === "success" && !iface.data) {
        return <>Interface not found</>;
    }

    if (redirectUrl) {
        return <Redirect push to={{ pathname: redirectUrl }} />;
    }

    return (
        <>
            <PanelTabbedForm
                onClose={handleBackClicked}
                labels={["Details", "Ethernet", "Statistics", "Hardware"]}
                content={[
                    <InterfaceTabDetails iface={iface.data} panelId={panelId} interfaceName={interfaceName} />,
                    <InterfaceTabEthernet iface={iface.data} panelId={panelId} interfaceName={interfaceName} />,
                    <InterfaceTabStatistics iface={iface.data} panelId={panelId} interfaceName={interfaceName} />,
                    <InterfaceTabHardware iface={iface.data} panelId={panelId} interfaceName={interfaceName} />,
                ]}
            ></PanelTabbedForm>
        </>
    );
}
