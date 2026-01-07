import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";
import BugTextField from "@core/BugTextField";
import { Box, Switch } from "@mui/material";
const IndentedName = ({ children }) => <Box sx={{ marginLeft: "1rem" }}>{children}</Box>;
const SectionTitle = ({ children }) => (
    <Box sx={{ color: "text.primary", opacity: 1, marginTop: "8px" }}>{children}</Box>
);

export default function MpegEncoderOutput({
    codecdata,
    index,
    onChange,
    onClose,
    showAdvanced,
    panelId,
    showCodecDropdown,
    ipInterfaces,
}) {
    const outputData = codecdata.outputs[index];
    const isClonedOutput = outputData.value.transportSettings.udp.output.hasOwnProperty("cloned");
    const isRtp = outputData?.value?.transportSettings?.udp?.settings?.rtp;

    let outputType = isRtp ? "RTP" : "UDP";
    const fecMode = isClonedOutput
        ? outputData?.value?.transportSettings?.udp?.output?.cloned?.a.fec?.value?.mode
        : outputData?.value?.transportSettings?.udp?.output?.single?.fec?.value?.mode;

    const fecColumns = isClonedOutput
        ? outputData?.value?.transportSettings?.udp?.output?.cloned?.a.fec?.value?.columns
        : outputData?.value?.transportSettings?.udp?.output?.single?.fec?.value?.columns;

    const fecRows = isClonedOutput
        ? outputData?.value?.transportSettings?.udp?.output?.cloned?.a.fec?.value?.rows
        : outputData?.value?.transportSettings?.udp?.output?.single?.fec?.value?.rows;

    if (fecMode === "A") {
        outputType = "RTP:FEC:A";
    }
    if (fecMode === "B") {
        outputType = "RTP:FEC:B";
    }

    const validFecDimensions = {
        4: [4, 20],
        5: [4, 20],
        6: [4, 16],
        7: [4, 14],
        8: [4, 12],
        9: [4, 11],
        10: [4, 10],
        11: [4, 9],
        12: [4, 8],
        13: [4, 7],
        14: [4, 7],
        15: [4, 6],
        16: [4, 6],
        17: [4, 5],
        18: [4, 5],
        19: [4, 5],
        20: [4, 5],
    };

    const updateOutput = (callback) => {
        const clonedCodecData = { ...codecdata };
        const clonedOutput = clonedCodecData.outputs[index];
        callback(clonedOutput);
        onChange(clonedCodecData);
    };

    const getDimensions = (value) => {
        const returnArray = [];
        for (let c = validFecDimensions[value][0]; c < validFecDimensions[value][1] + 1; c++) {
            returnArray.push({
                id: c,
                label: c.toString(),
            });
        }
        return returnArray;
    };

    const setFecRow = (rowValue, colValue) => {
        const validValues = getDimensions(colValue);
        if (rowValue < validValues[0]) {
            rowValue = validValues[0];
        } else if (rowValue > validValues[1]) {
            rowValue = validValues[1];
        }

        if (isClonedOutput) {
            updateOutput((output) => {
                output.value.transportSettings.udp.output.cloned.a.fec.value.rows = rowValue;
                output.value.transportSettings.udp.output.cloned.b.fec.value.rows = rowValue;
            });
        } else {
            updateOutput((output) => {
                output.value.transportSettings.udp.output.single.fec.value.rows = rowValue;
            });
        }
    };

    const setFecColumn = (colValue, rowValue) => {
        const validValues = getDimensions(rowValue);
        if (colValue < validValues[0]) {
            colValue = validValues[0];
        } else if (rowValue > validValues[1]) {
            colValue = validValues[1];
        }

        if (isClonedOutput) {
            updateOutput((output) => {
                output.value.transportSettings.udp.output.cloned.a.fec.value.columns = colValue;
                output.value.transportSettings.udp.output.cloned.b.fec.value.columns = colValue;
            });
        } else {
            updateOutput((output) => {
                output.value.transportSettings.udp.output.single.fec.value.columns = colValue;
            });
        }
    };

    const mappedIpInterfaces =
        ipInterfaces &&
        ipInterfaces.map((i) => {
            return {
                id: i.id,
                label: `${i.label ? i.label : i.name} (${i.ipv4address})`,
            };
        });

    const outputTypeChanged = (value) => {
        updateOutput((output) => {
            const valueArray = value.split(":");
            const fecEnabled = valueArray?.[1] === "FEC";
            let fecFields = {};

            if (fecEnabled) {
                // use existing values (if we're changing FEC type), otherwise default to 20x5
                fecFields = {
                    value: {
                        mode: valueArray[2],
                        columns: fecColumns ? fecColumns : 20,
                        rows: fecRows ? fecRows : 5,
                    },
                };
            }

            if (isClonedOutput) {
                output.value.transportSettings.udp.output.cloned.a.fecEnabled = fecEnabled;
                output.value.transportSettings.udp.output.cloned.a.fec = fecFields;
                output.value.transportSettings.udp.output.cloned.b.fec = fecFields;
            } else {
                output.value.transportSettings.udp.output.single.fecEnabled = fecEnabled;
                output.value.transportSettings.udp.output.single.fec = fecFields;
            }

            // set RTP
            output.value.transportSettings.udp.settings.rtp = valueArray?.[0] === "RTP";
        });
    };

    const clonedOutputChanged = (value) => {
        const aInterfaceId = ipInterfaces.find((i) => i.name === "D1").id;
        const bInterfaceId = ipInterfaces.find((i) => i.name === "D2").id;

        updateOutput((output) => {
            if (value) {
                // cloned output is now enabled so we copy the existing single values
                const single = output.value.transportSettings.udp.output.single;

                output.value.transportSettings.udp.output = {
                    cloned: {
                        a: {
                            interfaceId: aInterfaceId,
                            destination: {
                                address: single.destination.address,
                                port: single.destination.port,
                            },
                            sourceAddressEnabled: single.sourceAddressEnabled,
                            sourceAddress: single.sourceAddress,
                            sourcePortEnabled: single.sourcePortEnabled,
                            sourcePort: single.sourcePort,
                            fecEnabled: single.fecEnabled,
                            fec: single.fec,
                        },
                        b: {
                            interfaceId: bInterfaceId,
                            destination: {
                                address: single.destination.address,
                                port: single.destination.port + 10,
                            },
                            sourceAddressEnabled: single.sourceAddressEnabled,
                            sourceAddress: single.sourceAddress,
                            sourcePortEnabled: single.sourcePortEnabled,
                            sourcePort: single.sourcePort,
                            fecEnabled: single.fecEnabled,
                            fec: single.fec,
                        },
                    },
                };
            } else {
                // cloned output is now disabled so we copy the a output across only
                const cloned_a = output.value.transportSettings.udp.output.cloned.a;
                output.value.transportSettings.udp.output = {
                    single: {
                        interfaceId: aInterfaceId,
                        destination: {
                            address: cloned_a.destination.address,
                            port: cloned_a.destination.port,
                        },
                        sourceAddressEnabled: cloned_a.sourceAddressEnabled,
                        sourceAddress: cloned_a.sourceAddress,
                        sourcePortEnabled: cloned_a.sourcePortEnabled,
                        sourcePort: cloned_a.sourcePort,
                        fecEnabled: cloned_a.fecEnabled,
                        fec: cloned_a.fec,
                    },
                };
            }
        });
    };

    return (
        <>
            <BugDetailsCard
                closable
                onClose={() => onClose(index)}
                title={`Output ${index + 1}`}
                width="11rem"
                items={[
                    {
                        name: "Enabled",
                        value: (
                            <Switch
                                checked={outputData?.value.enabled}
                                onChange={(event) =>
                                    updateOutput((output) => {
                                        output.value.enabled = event.target.checked;
                                    })
                                }
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "Name",
                        value: (
                            <BugTextField
                                changeOnBlur
                                value={outputData?.value?.label}
                                onChange={(event) =>
                                    updateOutput((output) => {
                                        output.value.label = event.target.value;
                                    })
                                }
                            ></BugTextField>
                        ),
                    },
                    {
                        name: "Output Type",
                        value: (
                            <BugSelect
                                value={outputType}
                                options={[
                                    { id: "UDP", label: "UDP" },
                                    { id: "RTP", label: "RTP" },
                                    { id: "RTP:FEC:A", label: "RTP with FEC - Level A" },
                                    { id: "RTP:FEC:B", label: "RTP with FEC - Level B" },
                                ]}
                                onChange={(event) => outputTypeChanged(event.target.value)}
                            ></BugSelect>
                        ),
                    },
                    fecMode && {
                        name: "FEC Columns",
                        value: (
                            <BugSelect
                                value={fecColumns}
                                onChange={(event) => setFecColumn(event.target.value, fecRows)}
                                options={getDimensions(fecRows)}
                            ></BugSelect>
                        ),
                    },
                    fecMode && {
                        name: "FEC Rows",
                        value: (
                            <BugSelect
                                value={fecRows}
                                onChange={(event) => setFecRow(event.target.value, fecColumns)}
                                options={getDimensions(fecColumns)}
                            ></BugSelect>
                        ),
                    },
                    showAdvanced && {
                        name: "DSCP",
                        value: (
                            <BugTextField
                                value={outputData?.value?.transportSettings?.udp?.settings?.dscp}
                                onChange={(event) =>
                                    updateOutput((output) => {
                                        output.value.transportSettings.udp.settings.dscp = parseInt(event.target.value);
                                    })
                                }
                                filter={/[^0-9]/}
                                changeOnBlur
                                numeric
                                min={1}
                                max={255}
                            ></BugTextField>
                        ),
                    },
                    showAdvanced && {
                        name: "TTL",
                        value: (
                            <BugTextField
                                value={outputData?.value?.transportSettings?.udp?.settings?.ttl}
                                onChange={(event) =>
                                    updateOutput((output) => {
                                        output.value.transportSettings.udp.settings.ttl = parseInt(event.target.value);
                                    })
                                }
                                filter={/[^0-9]/}
                                changeOnBlur
                                numeric
                                min={1}
                                max={255}
                            />
                        ),
                    },
                    {
                        name: "Cloned Output",
                        value: (
                            <Switch
                                checked={isClonedOutput}
                                onChange={(event) => clonedOutputChanged(event.target.checked)}
                            />
                        ),
                    },
                    // showCodecDropdown && {
                    //     name: "Codec",
                    //     value: (
                    //         <BugCodecAutocomplete
                    //             addressValue={outputData?.outputIP}
                    //             portValue={outputData?.outputPort}
                    //             apiUrl={`/container/${panelId}/codecdb`}
                    //             capability={codecCapability}
                    //             onChange={(event, codec) => {
                    //                 onChange({
                    //                     outputIP: codec.address,
                    //                     outputPort: codec.port,
                    //                 });
                    //             }}
                    //         />
                    //     ),
                    // },
                    !isClonedOutput && {
                        name: "Interface",
                        value: (
                            <BugSelect
                                value={outputData?.value?.transportSettings?.udp?.output?.single?.interfaceId}
                                onChange={(event) =>
                                    updateOutput((output) => {
                                        output.value.transportSettings.udp.output.single.interfaceId =
                                            event.target.value;
                                    })
                                }
                                options={mappedIpInterfaces ? mappedIpInterfaces : []}
                            ></BugSelect>
                        ),
                    },
                    !isClonedOutput && {
                        name: "IP Address",
                        value: (
                            <BugTextField
                                changeOnBlur
                                value={outputData?.value?.transportSettings?.udp?.output?.single?.destination?.address}
                                onChange={(event) =>
                                    updateOutput((output) => {
                                        output.value.transportSettings.udp.output.single.destination.address =
                                            event.target.value;
                                    })
                                }
                            />
                        ),
                    },
                    !isClonedOutput && {
                        name: "Port",
                        value: (
                            <BugTextField
                                changeOnBlur
                                value={outputData?.value?.transportSettings?.udp?.output?.single?.destination?.port}
                                onChange={(event) =>
                                    updateOutput((output) => {
                                        output.value.transportSettings.udp.output.single.destination.port = parseInt(
                                            event.target.value
                                        );
                                    })
                                }
                                filter={/[^0-9]/}
                                numeric
                                min={1024}
                                max={65531}
                            />
                        ),
                    },
                    isClonedOutput && {
                        name: <SectionTitle>Path A</SectionTitle>,
                        value: null,
                    },
                    showAdvanced &&
                        isClonedOutput && {
                            name: <IndentedName>Interface</IndentedName>,
                            value: (
                                <BugSelect
                                    value={outputData?.value?.transportSettings?.udp?.output?.cloned?.a?.interfaceId}
                                    onChange={(event) =>
                                        updateOutput((output) => {
                                            output.value.transportSettings.udp.output.cloned.a.interfaceId =
                                                event.target.value;
                                        })
                                    }
                                    options={mappedIpInterfaces ? mappedIpInterfaces : []}
                                ></BugSelect>
                            ),
                        },
                    isClonedOutput && {
                        name: <IndentedName>IP Address</IndentedName>,
                        value: (
                            <BugTextField
                                changeOnBlur
                                value={
                                    outputData?.value?.transportSettings?.udp?.output?.cloned?.a?.destination?.address
                                }
                                onChange={(event) =>
                                    updateOutput((output) => {
                                        output.value.transportSettings.udp.output.cloned.a.destination.address =
                                            event.target.value;
                                    })
                                }
                            />
                        ),
                    },
                    isClonedOutput && {
                        name: <IndentedName>Port</IndentedName>,
                        value: (
                            <BugTextField
                                value={outputData?.value?.transportSettings?.udp?.output?.cloned?.a?.destination?.port}
                                onChange={(event) =>
                                    updateOutput((output) => {
                                        output.value.transportSettings.udp.output.cloned.a.destination.port = parseInt(
                                            event.target.value
                                        );
                                    })
                                }
                                changeOnBlur
                                filter={/[^0-9]/}
                                numeric
                                min={1024}
                                max={65531}
                            />
                        ),
                    },
                    isClonedOutput && {
                        name: <SectionTitle>Path B</SectionTitle>,
                        value: null,
                    },
                    showAdvanced &&
                        isClonedOutput && {
                            name: <IndentedName>Interface</IndentedName>,
                            value: (
                                <BugSelect
                                    value={outputData?.value?.transportSettings?.udp?.output?.cloned?.b?.interfaceId}
                                    onChange={(event) =>
                                        updateOutput((output) => {
                                            output.value.transportSettings.udp.output.cloned.b.interfaceId =
                                                event.target.value;
                                        })
                                    }
                                    options={mappedIpInterfaces ? mappedIpInterfaces : []}
                                ></BugSelect>
                            ),
                        },
                    isClonedOutput && {
                        name: <IndentedName>IP Address</IndentedName>,
                        value: (
                            <BugTextField
                                changeOnBlur
                                value={
                                    outputData?.value?.transportSettings?.udp?.output?.cloned?.b?.destination?.address
                                }
                                onChange={(event) =>
                                    updateOutput((output) => {
                                        output.value.transportSettings.udp.output.cloned.b.destination.address =
                                            event.target.value;
                                    })
                                }
                            />
                        ),
                    },
                    isClonedOutput && {
                        name: <IndentedName>Port</IndentedName>,
                        value: (
                            <BugTextField
                                value={outputData?.value?.transportSettings?.udp?.output?.cloned?.b?.destination?.port}
                                onChange={(event) =>
                                    updateOutput((output) => {
                                        output.value.transportSettings.udp.output.cloned.b.destination.port = parseInt(
                                            event.target.value
                                        );
                                    })
                                }
                                filter={/[^0-9]/}
                                changeOnBlur
                                numeric
                                min={1024}
                                max={65531}
                            />
                        ),
                    },
                ]}
            />
        </>
    );
}
