import React from "react";
import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";
import BugTextField from "@core/BugTextField";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import { useAlert } from "@utils/Snackbar";
import AxiosGet from "@utils/AxiosGet";

export default function CodecInput({ codecdata, onChange, showAdvanced, panelId }) {
    const sendAlert = useAlert();
    const [isDetecting, setIsDetecting] = React.useState(false);

    const handleDetect = async () => {
        setIsDetecting(true);
        sendAlert(`Detecting input ...`, { variant: "info" });
        const result = await AxiosGet(`/container/${panelId}/input/detect/`);
        if (result === 19) {
            sendAlert(`No input signal detected`, { variant: "warning" });
        } else if (result) {
            sendAlert(`Successfully detected input`, { variant: "success" });
            onChange({ inputVideoFormat: result });
        } else {
            sendAlert(`Failed to detect input`, { variant: "error" });
        }
        setIsDetecting(false);
    };

    return (
        <>
            <BugDetailsCard
                title="Input"
                width="10rem"
                data={[
                    {
                        name: "Transmit",
                        value: (
                            <Switch
                                checked={codecdata?.obeEncoderRowStatus === 1}
                                onChange={(event) => onChange({ obeEncoderRowStatus: event.target.checked ? 1 : 2 })}
                            />
                        ),
                    },
                    {
                        name: "Name",
                        value: (
                            <BugTextField
                                value={codecdata?.obeEncoderName}
                                onChange={(event) => onChange({ obeEncoderName: event.target.value })}
                            ></BugTextField>
                        ),
                    },
                    showAdvanced && {
                        name: "Source",
                        value: (
                            <BugSelect
                                value={codecdata?.inputDeviceType}
                                onChange={(event) => onChange({ inputDeviceType: parseInt(event.target.value) })}
                                items={{
                                    1: "SDI",
                                    2: "Bars and Tone",
                                    3: "SMPTE 2022-6",
                                    4: "SMPTE 2022-7",
                                    5: "SMPTE 2110 (Dual)",
                                    6: "SMPTE 2110",
                                    7: "OBE SDI",
                                }}
                            ></BugSelect>
                        ),
                    },
                    showAdvanced && {
                        name: "Card Index",
                        value: (
                            <BugSelect
                                disabled={codecdata?.inputDeviceType !== 1 && codecdata?.inputDeviceType !== 7}
                                value={codecdata?.inputCardidx}
                                onChange={(event) => onChange({ inputCardidx: parseInt(event.target.value) })}
                                items={{
                                    0: "Input 0",
                                    1: "Input 1",
                                    2: "Input 2",
                                    3: "Input 3",
                                }}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Video Format",
                        value: (
                            <Box
                                sx={{
                                    display: "flex",
                                }}
                            >
                                <BugSelect
                                    value={codecdata?.inputVideoFormat}
                                    disabled={isDetecting}
                                    onChange={(event) => onChange({ inputVideoFormat: parseInt(event.target.value) })}
                                    items={{
                                        1: "625i (PAL)",
                                        2: "480i (NTSC)",
                                        3: "720p50",
                                        4: "720p59.94",
                                        5: "1080i50",
                                        6: "1080i59.94",
                                        7: "1080p23.98",
                                        8: "1080p24",
                                        9: "1080p25",
                                    }}
                                ></BugSelect>
                                <IconButton
                                    sx={{ marginLeft: "4px", width: "48px" }}
                                    disabled={isDetecting}
                                    onClick={handleDetect}
                                >
                                    <GpsFixedIcon />
                                </IconButton>
                            </Box>
                        ),
                    },
                    showAdvanced && {
                        name: "On Signal Loss",
                        value: (
                            <BugSelect
                                value={codecdata?.inputPictureOnSignalLoss}
                                onChange={(event) =>
                                    onChange({ inputPictureOnSignalLoss: parseInt(event.target.value) })
                                }
                                items={{
                                    1: "Stop Streaming",
                                    2: "Bars and Tone",
                                    3: "Last good frame",
                                    4: "Black",
                                }}
                            ></BugSelect>
                        ),
                    },
                    showAdvanced && {
                        name: "Auto-start",
                        value: (
                            <Switch
                                checked={codecdata?.obeEncoderAutoStart === 2}
                                onChange={(event) => onChange({ obeEncoderAutoStart: event.target.checked ? 2 : 1 })}
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "SD Downscale",
                        value: (
                            <BugSelect
                                value={codecdata?.inputSDDownscale}
                                onChange={(event) => onChange({ inputSDDownscale: parseInt(event.target.value) })}
                                items={{
                                    1: "Disabled",
                                    2: "Fast",
                                }}
                            ></BugSelect>
                        ),
                    },
                ]}
            />
        </>
    );
}
