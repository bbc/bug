import React from "react";
import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";
import BugTextField from "@core/BugTextField";
import Switch from "@mui/material/Switch";
import { useApiPoller } from "@hooks/ApiPoller";
import { unflatten } from "flat";
import deepmerge from "deepmerge";

export default function MpegEncoderService({ codecdata, onChange, showAdvanced, panelId, serviceId }) {
    const videoProfiles = useApiPoller({
        url: `/container/${panelId}/mpegencodeprofile/video`,
        interval: 20000,
    });

    const colorProfiles = useApiPoller({
        url: `/container/${panelId}/mpegencodeprofile/color`,
        interval: 20000,
    });

    const setMultiCodecData = (values) => {
        onChange(deepmerge(codecdata, unflatten(values)));
    };

    return (
        <>
            <BugDetailsCard
                title="Service"
                width="10rem"
                items={[
                    {
                        name: "Enabled",
                        value: (
                            <Switch
                                checked={codecdata?.encoderService.value.enabled}
                                onChange={(event) =>
                                    setMultiCodecData({ "encoderService.value.enabled": event.target.checked })
                                }
                            />
                        ),
                    },
                    {
                        name: "Slot/Port",
                        value: <BugTextField disabled value={codecdata?.encoderService._slotPort}></BugTextField>,
                    },
                    {
                        name: "Name",
                        value: (
                            <BugTextField
                                value={codecdata?.encoderService.value.label}
                                placeholder={codecdata?.encoderService?.value?.output?.ts?.serviceName}
                                onChange={(event) =>
                                    setMultiCodecData({ "encoderService.value.label": event.target.value })
                                }
                            ></BugTextField>
                        ),
                    },
                    showAdvanced && {
                        name: "Video Profile",
                        value: (
                            <BugSelect
                                value={codecdata?.encoderService?.value?.video?.profile?.id}
                                onChange={(event) =>
                                    setMultiCodecData({ "encoderService.value.video.profile.id": event.target.value })
                                }
                                options={videoProfiles?.data ? videoProfiles.data : []}
                            ></BugSelect>
                        ),
                    },
                    showAdvanced && {
                        name: "Color Profile",
                        value: (
                            <BugSelect
                                value={codecdata?.encoderService?.value?.color?.value?.profile?.id}
                                onChange={(event) =>
                                    setMultiCodecData({
                                        "encoderService.value.color.value.profile.id": event.target.value,
                                    })
                                }
                                options={colorProfiles?.data ? colorProfiles.data : []}
                            ></BugSelect>
                        ),
                    },

                    {
                        name: "On Signal Loss",
                        value: (
                            <BugSelect
                                value={codecdata?.encoderService.value.signalLoss}
                                onChange={(event) =>
                                    setMultiCodecData({ "encoderService.value.signalLoss": event.target.value })
                                }
                                options={[
                                    { id: "COLOR_BAR", label: "Color Bar" },
                                    { id: "BLACK_FRAME", label: "Black Frame" },
                                    { id: "FREEZE_FRAME", label: "Freeze Frame" },
                                    { id: "TEST_GENERATOR", label: "Test Generator" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Test Enabled",
                        value: (
                            <Switch
                                checked={codecdata?.testGeneratorProfile.value.enable}
                                onChange={(event) =>
                                    setMultiCodecData({
                                        "testGeneratorProfile.value.enable": event.target.checked,
                                    })
                                }
                            />
                        ),
                    },
                ]}
            />
        </>
    );
}
