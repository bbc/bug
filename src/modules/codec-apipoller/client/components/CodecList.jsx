import React from "react";
import AxiosGet from "@utils/AxiosGet";
import BugApiTable from "@core/BugApiTable";
import BugNoData from "@core/BugNoData";
import Chip from "@mui/material/Chip";

export default function CodecList({ panelId }) {
    const [zones, setZones] = React.useState([]);
    const [capabilities, setCapabilities] = React.useState([]);
    const [deviceTags, setDeviceTags] = React.useState([]);

    const fetchOptions = async (url, setter) => {
        const response = await AxiosGet(url);
        if (response) {
            setter(response);
        }
    };

    React.useEffect(() => {
        fetchOptions(`/container/${panelId}/codec/getoptions/zones`, setZones);
        fetchOptions(`/container/${panelId}/codec/getoptions/capabilities`, setCapabilities);
        fetchOptions(`/container/${panelId}/codec/getoptions/devicetags`, setDeviceTags);
    }, []);

    return (
        <>
            <BugApiTable
                columns={[
                    {
                        title: "Name",
                        minWidth: 200,
                        noWrap: true,
                        sortable: true,
                        field: "name",
                        filterType: "text",
                        content: (item) => item.name,
                    },
                    {
                        title: "Zones",
                        width: "20%",
                        minWidth: 110,
                        field: "zones",
                        content: (item) => {
                            return item?.zones.map((eachItem) => <Chip key={eachItem} label={eachItem} />);
                        },
                        filterType: "multidropdown",
                        filterOptions: zones.map((item) => {
                            return { id: item, label: item };
                        }),
                    },
                    {
                        title: "Capabilities",
                        minWidth: 110,
                        field: "capabilities",
                        content: (item) => {
                            return item?.capabilities.map((eachItem) => <Chip key={eachItem} label={eachItem} />);
                        },
                        filterType: "multidropdown",
                        filterOptions: capabilities.map((item) => {
                            return { id: item, label: item };
                        }),
                    },
                    {
                        title: "Address",
                        minWidth: 110,
                        noWrap: true,
                        sortable: true,
                        content: (item) => item?.address,
                        field: "address",
                        filterType: "text",
                    },
                    {
                        title: "Port",
                        minWidth: 80,
                        width: 100,
                        noWrap: true,
                        sortable: true,
                        content: (item) => item?.port,
                        field: "port",
                        filterType: "text",
                    },
                    {
                        title: "Device Tags",
                        minWidth: 110,
                        content: (item) => {
                            return item?.devicetags.map((eachItem) => <Chip key={eachItem} label={eachItem} />);
                        },
                        field: "devicetags",
                        filterType: "multidropdown",
                        filterOptions: deviceTags.map((item) => {
                            return { id: item, label: item };
                        }),
                    },
                    {
                        title: "Device",
                        minWidth: 200,
                        content: (item) => {
                            return (
                                <>
                                    {item.devicemanufacturer} {item.devicemodel}
                                </>
                            );
                        },
                    },
                ]}
                apiUrl={`/container/${panelId}/codec/`}
                noData={<BugNoData panelId={panelId} title="No codecs found" showConfigButton={false} />}
                sortable
                filterable
            />
        </>
    );
}
