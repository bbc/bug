import React from "react";
import PanelTabbedForm from "@core/PanelTabbedForm";
import { Redirect } from "react-router";
import InterfaceTabDetails from "./InterfaceTabDetails";
import InterfaceTabEthernet from "./InterfaceTabEthernet";
import InterfaceTabStatistics from "./InterfaceTabStatistics";

export default function Interface({ panelId, interfaceName }) {
    const [redirectUrl, setRedirectUrl] = React.useState(null);

    const handleBackClicked = () => {
        setRedirectUrl(`/panel/${panelId}`);
    };

    if (redirectUrl) {
        return <Redirect push to={{ pathname: redirectUrl }} />;
    }

    console.log("Interface.jsx", panelId, interfaceName);

    return (
        <>
            <PanelTabbedForm
                onClose={handleBackClicked}
                labels={["Details", "Ethernet", "Statistics", "Hardware"]}
                content={[
                    <InterfaceTabDetails panelId={panelId} interfaceName={interfaceName} />,
                    <InterfaceTabEthernet panelId={panelId} interfaceName={interfaceName} />,
                    <InterfaceTabStatistics panelId={panelId} interfaceName={interfaceName} />,
                ]}
            ></PanelTabbedForm>
        </>
    );
}
