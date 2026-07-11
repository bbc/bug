import BugApiTable from "@core/BugApiTable";
import BugNoData from "@core/BugNoData";
import { Chip } from "@mui/material";
import AxiosGet from "@utils/AxiosGet";
import React from "react";

export default function CodecList({ panelId }) {
    const [zoneOptions, setZoneOptions] = React.useState([]);
    const [capabilities, setCapabilities] = React.useState([]);
    const [deviceTags, setDeviceTags] = React.useState([]);

    React.useEffect(() => {
        let isMounted = true;

        const fetchOptions = async (url, setter) => {
            try {
                const response = await AxiosGet(url);
                if (isMounted) {
                    setter(Array.isArray(response) ? response : []);
                }
            } catch {
                if (isMounted) {
                    setter([]);
                }
            }
        };

        fetchOptions(`/container/${panelId}/codec/getoptions/zone`, setZoneOptions);
        fetchOptions(`/container/${panelId}/codec/getoptions/capabilities`, setCapabilities);
        fetchOptions(`/container/${panelId}/codec/getoptions/device.tags`, setDeviceTags);

        return () => {
            isMounted = false;
        };
    }, [panelId]);

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
                        title: "Zone",
                        width: "20%",
                        minWidth: 110,
                        field: "zone",
                        content: (item) => {
                            return item?.zone ? <Chip key={item.zone} label={item.zone} /> : null;
                        },
                        filterType: "multidropdown",
                        filterOptions: zoneOptions.map((item) => {
                            return { id: item, label: item };
                        }),
                    },
                    {
                        title: "Capabilities",
                        minWidth: 110,
                        field: "capabilities",
                        content: (item) => {
                            return item?.capabilities?.map((eachItem) => <Chip key={eachItem} label={eachItem} />);
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
                            return item?.device?.tags?.map((eachItem) => <Chip key={eachItem} label={eachItem} />);
                        },
                        field: "device.tags",
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
                                    {item?.device?.manufacturer || "-"} {item?.device?.model || ""}
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
