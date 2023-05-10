import React from "react";
import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";
import BugColorPicker from "@core/BugColorPicker";
import Switch from "@mui/material/Switch";
import rgbHex from "rgb-hex";
import { unflatten } from "flat";
import deepmerge from "deepmerge";

export default function MpegEncoderTest({ codecdata, onChange, showAdvanced, panelId, serviceId }) {
    const hexColor = rgbHex(
        codecdata?.testGeneratorProfile.value.testGenVariant.testGenerator.box.color.red,
        codecdata?.testGeneratorProfile.value.testGenVariant.testGenerator.box.color.green,
        codecdata?.testGeneratorProfile.value.testGenVariant.testGenerator.box.color.blue
    );

    const setMultiCodecData = (values) => {
        onChange(deepmerge(codecdata, unflatten(values)));
    };

    return (
        <>
            <BugDetailsCard
                title={`Test Generator: ${codecdata?.testGeneratorProfile.value.label}`}
                width="10rem"
                items={[
                    {
                        name: "Enabled",
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
                    showAdvanced && {
                        name: "Audio Test Tone",
                        value: (
                            <Switch
                                checked={codecdata?.testGeneratorProfile.value.testGenVariant.testGenerator.testTone}
                                onChange={(event) =>
                                    setMultiCodecData({
                                        "testGeneratorProfile.value.testGenVariant.testGenerator.testTone":
                                            event.target.checked,
                                    })
                                }
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "Test Pattern",
                        value: (
                            <BugSelect
                                value={codecdata?.testGeneratorProfile.value.testGenVariant.testGenerator.testPattern}
                                onChange={(event) =>
                                    setMultiCodecData({
                                        "testGeneratorProfile.value.testGenVariant.testGenerator.testPattern":
                                            event.target.value,
                                    })
                                }
                                options={[
                                    { id: "COLOR_BAR", label: "Color Bar" },
                                    { id: "BLACK_FRAME", label: "Black Frame" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    showAdvanced && {
                        name: "Text Overlay",
                        value: (
                            <Switch
                                checked={codecdata?.testGeneratorProfile.value.testGenVariant.testGenerator.text.enable}
                                onChange={(event) =>
                                    setMultiCodecData({
                                        "testGeneratorProfile.value.testGenVariant.testGenerator.text.enable":
                                            event.target.checked,
                                    })
                                }
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "Text Position",
                        value: (
                            <BugSelect
                                value={codecdata?.testGeneratorProfile.value.testGenVariant.testGenerator.text.position}
                                onChange={(event) =>
                                    setMultiCodecData({
                                        "testGeneratorProfile.value.testGenVariant.testGenerator.text.position":
                                            event.target.value,
                                    })
                                }
                                options={[
                                    { id: "TOP", label: "Top" },
                                    { id: "MIDDLE", label: "Middle" },
                                    { id: "BOTTOM", label: "Bottom" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    showAdvanced && {
                        name: "Text Background",
                        value: (
                            <BugSelect
                                value={
                                    codecdata?.testGeneratorProfile.value.testGenVariant.testGenerator.text
                                        .backgroundType
                                }
                                onChange={(event) =>
                                    setMultiCodecData({
                                        "testGeneratorProfile.value.testGenVariant.testGenerator.text.backgroundType":
                                            event.target.value,
                                    })
                                }
                                options={[
                                    { id: "BLACK", label: "Black" },
                                    { id: "TRANSPARENT", label: "Transparent" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    showAdvanced && {
                        name: "Moving Box",
                        value: (
                            <Switch
                                checked={codecdata?.testGeneratorProfile.value.testGenVariant.testGenerator.box.enable}
                                onChange={(event) =>
                                    setMultiCodecData({
                                        "testGeneratorProfile.value.testGenVariant.testGenerator.box.enable":
                                            event.target.checked,
                                    })
                                }
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "Box Color",
                        value: (
                            <BugColorPicker
                                color={`#${hexColor}`}
                                onColorChange={(result) => {
                                    setMultiCodecData({
                                        "testGeneratorProfile.value.testGenVariant.testGenerator.box.color.red":
                                            result.rgb.r,
                                        "testGeneratorProfile.value.testGenVariant.testGenerator.box.color.green":
                                            result.rgb.g,
                                        "testGeneratorProfile.value.testGenVariant.testGenerator.box.color.blue":
                                            result.rgb.b,
                                    });
                                }}
                            ></BugColorPicker>
                        ),
                    },
                ]}
            />
        </>
    );
}
