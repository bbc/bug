import React from "react";
import { useApiPoller } from "@hooks/ApiPoller";
import BugLoading from "@core/BugLoading";
import BugNoData from "@core/BugNoData";
import BugApiSelect from "@core/BugApiSelect";
import BugApiSwitch from "@core/BugApiSwitch";
import BugDetailsTable from "@core/BugDetailsTable";
import AxiosGet from "@utils/AxiosGet";
import { useForceRefresh } from "@hooks/ForceRefresh";
import { useAlert } from "@utils/Snackbar";

export default function TabConfig({ panelId }) {
    const sendAlert = useAlert(panelId);
    const [forceRefresh, doForceRefresh] = useForceRefresh();

    const deviceConfig = useApiPoller({
        url: `/container/${panelId}/deviceconfig`,
        interval: 5000,
        forceRefresh: forceRefresh,
    });

    if (deviceConfig.status === "idle" || deviceConfig.status === "loading") {
        return <BugLoading height="30vh" />;
    }
    if (deviceConfig.status === "success" && !deviceConfig.data) {
        return <BugNoData title="No current data found" showConfigButton={true} />;
    }

    const handleLayoutChanged = async (event) => {
        if (await AxiosGet(`/container/${panelId}/deviceconfig/setlayout/${event.target.value}`)) {
            doForceRefresh();
            sendAlert(`Set layout to ${event.target.value}`, { variant: "success" });
        } else {
            sendAlert(`Failed to set layout to ${event.target.value}`, { variant: "error" });
        }
    };

    const handleBoolConfigChanged = async (value, field, label) => {
        if (await AxiosGet(`/container/${panelId}/deviceconfig/set/${field}/${value}`)) {
            doForceRefresh();
            sendAlert(`${value ? "Enabled" : "Disabled"} config setting: '${label}'`, { variant: "success" });
        } else {
            sendAlert(`Failed to ${value ? "enable" : "disable"} config setting: '${label}'`, { variant: "error" });
        }
    };

    const handleStringConfigChanged = async (value, field, label) => {
        if (await AxiosGet(`/container/${panelId}/deviceconfig/set/${field}/${value}`)) {
            doForceRefresh();
            sendAlert(`Set config setting: '${label}' to '${value}'`, { variant: "success" });
        } else {
            sendAlert(`Failed to set config setting: '${label}' to '${value}'`, { variant: "error" });
        }
    };

    return (
        <>
            <BugDetailsTable
                items={[
                    {
                        name: "Layout",
                        value: (
                            <BugApiSelect
                                onChange={handleLayoutChanged}
                                options={[
                                    { id: "2x2", label: "2x2" },
                                    { id: "3x3", label: "3x3" },
                                    { id: "4x4", label: "4x4" },
                                ]}
                                value={deviceConfig?.data?.layout}
                            />
                        ),
                    },
                    {
                        name: "Output Format",
                        value: (
                            <BugApiSelect
                                onChange={(event) =>
                                    handleStringConfigChanged(event.target.value, "Output Format", "Output Format")
                                }
                                options={[
                                    { id: "50i", label: "1080i50" },
                                    { id: "50p", label: "1080p25" },
                                    { id: "60i", label: "1080i59.94" },
                                    { id: "60p", label: "1080i29.97" },
                                ]}
                                value={deviceConfig?.data?.output_format}
                            />
                        ),
                    },
                    {
                        name: "Widescreen SD",
                        value: (
                            <BugApiSwitch
                                onChange={(checked) =>
                                    handleBoolConfigChanged(checked, "Widescreen SD enabled", "Widescreen SD")
                                }
                                checked={deviceConfig?.data?.widescreen_sd_enabled}
                            />
                        ),
                    },
                    {
                        name: "Display Border",
                        value: (
                            <BugApiSwitch
                                onChange={(checked) =>
                                    handleBoolConfigChanged(checked, "Display border", "Display Border")
                                }
                                checked={deviceConfig?.data?.display_border}
                            />
                        ),
                    },
                    {
                        name: "Display Labels",
                        value: (
                            <BugApiSwitch
                                onChange={(checked) =>
                                    handleBoolConfigChanged(checked, "Display labels", "Display labels")
                                }
                                checked={deviceConfig?.data?.display_labels}
                            />
                        ),
                    },
                    {
                        name: "Display Audio",
                        value: (
                            <BugApiSwitch
                                onChange={(checked) =>
                                    handleBoolConfigChanged(checked, "Display audio meters", "Display Audio")
                                }
                                checked={deviceConfig?.data?.display_audio_meters}
                            />
                        ),
                    },
                    {
                        name: "Display SDI Tally",
                        value: (
                            <BugApiSwitch
                                onChange={(checked) =>
                                    handleBoolConfigChanged(checked, "Display SDI tally", "Display SDI Tally")
                                }
                                checked={deviceConfig?.data?.display_sdi_tally}
                            />
                        ),
                    },
                ]}
            />
        </>
    );
}
