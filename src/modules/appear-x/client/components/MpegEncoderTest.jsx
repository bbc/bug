import BugColorPicker from "@core/BugColorPicker";
import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";
import { Switch } from "@mui/material";
import rgbHex from "rgb-hex";

export default function MpegEncoderTest({ codecdata, onChange, showAdvanced, panelId, serviceId }) {
    const hexColor = codecdata?.testGeneratorProfile
        ? rgbHex(
              codecdata?.testGeneratorProfile?.value?.testGenVariant?.testGenerator?.box?.color?.red,
              codecdata?.testGeneratorProfile?.value?.testGenVariant?.testGenerator?.box?.color?.green,
              codecdata?.testGeneratorProfile?.value?.testGenVariant?.testGenerator?.box?.color?.blue
          )
        : null;

    const updateOutput = (callback) => {
        const clonedCodecData = { ...codecdata };
        callback(clonedCodecData);
        onChange(clonedCodecData);
    };

    return codecdata?.testGeneratorProfile?.value?.enable ? (
        <>
            <BugDetailsCard
                title={`Test Generator: ${codecdata?.testGeneratorProfile.value.label}`}
                width="10rem"
                items={[
                    {
                        name: "Audio Test Tone",
                        value: (
                            <Switch
                                checked={codecdata?.testGeneratorProfile.value.testGenVariant.testGenerator.testTone}
                                onChange={(event) =>
                                    updateOutput((codecdata) => {
                                        codecdata.testGeneratorProfile.value.testGenVariant.testGenerator.testTone =
                                            event.target.checked;
                                    })
                                }
                            />
                        ),
                    },
                    {
                        name: "Test Pattern",
                        value: (
                            <BugSelect
                                value={codecdata?.testGeneratorProfile.value.testGenVariant.testGenerator.testPattern}
                                onChange={(event) =>
                                    updateOutput((codecdata) => {
                                        codecdata.testGeneratorProfile.value.testGenVariant.testGenerator.testPattern =
                                            event.target.value;
                                    })
                                }
                                options={[
                                    { id: "COLOR_BAR", label: "Color Bar" },
                                    { id: "BLACK_FRAME", label: "Black Frame" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Text Overlay",
                        value: (
                            <Switch
                                checked={codecdata?.testGeneratorProfile.value.testGenVariant.testGenerator.text.enable}
                                onChange={(event) =>
                                    updateOutput((codecdata) => {
                                        codecdata.testGeneratorProfile.value.testGenVariant.testGenerator.text.enable =
                                            event.target.checked;
                                    })
                                }
                            />
                        ),
                    },
                    {
                        name: "Text Position",
                        value: (
                            <BugSelect
                                value={codecdata?.testGeneratorProfile.value.testGenVariant.testGenerator.text.position}
                                onChange={(event) =>
                                    updateOutput((codecdata) => {
                                        codecdata.testGeneratorProfile.value.testGenVariant.testGenerator.text.position =
                                            event.target.value;
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
                    {
                        name: "Text Background",
                        value: (
                            <BugSelect
                                value={
                                    codecdata?.testGeneratorProfile.value.testGenVariant.testGenerator.text
                                        .backgroundType
                                }
                                onChange={(event) =>
                                    updateOutput((codecdata) => {
                                        codecdata.testGeneratorProfile.value.testGenVariant.testGenerator.text.backgroundType =
                                            event.target.value;
                                    })
                                }
                                options={[
                                    { id: "BLACK", label: "Black" },
                                    { id: "TRANSPARENT", label: "Transparent" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Moving Box",
                        value: (
                            <Switch
                                checked={codecdata?.testGeneratorProfile.value.testGenVariant.testGenerator.box.enable}
                                onChange={(event) =>
                                    updateOutput((codecdata) => {
                                        codecdata.testGeneratorProfile.value.testGenVariant.testGenerator.box.enable =
                                            event.target.checked;
                                    })
                                }
                            />
                        ),
                    },
                    {
                        name: "Box Color",
                        value: (
                            <BugColorPicker
                                color={`#${hexColor}`}
                                onColorChange={(result) => {
                                    updateOutput((codecdata) => {
                                        codecdata.testGeneratorProfile.value.testGenVariant.testGenerator.box.color.red =
                                            result.rgb.r;
                                        codecdata.testGeneratorProfile.value.testGenVariant.testGenerator.box.color.green =
                                            result.rgb.g;
                                        codecdata.testGeneratorProfile.value.testGenVariant.testGenerator.box.color.blue =
                                            result.rgb.b;
                                    });
                                }}
                            ></BugColorPicker>
                        ),
                    },
                ]}
            />
        </>
    ) : null;
}
