import React from "react";
import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";
import BugTextfield from "@core/BugTextfield";
import Switch from "@mui/material/Switch";

export default function CodecVideo({ codecdata, onChange, outputIndex, showAdvanced, collapsed }) {
    console.log("codecoutput");
    return (
        <>
            <BugDetailsCard
                collapsible
                collapsed={collapsed}
                title={`Output ${outputIndex + 1}`}
                width="11rem"
                data={[
                    {
                        name: "Transmit",
                        value: (
                            <Switch
                                checked={codecdata?.[`outputs_${outputIndex}_StreamTransmission`] === 0}
                                onChange={(event) =>
                                    onChange(event.target.checked ? 0 : 1, `outputs_${outputIndex}_StreamTransmission`)
                                }
                            />
                        ),
                    },
                    {
                        name: "Output Type",
                        value: (
                            <BugSelect
                                value={codecdata?.[`outputs_${outputIndex}_StreamProtocol`]}
                                onChange={(event) =>
                                    onChange(parseInt(event.target.value), `outputs_${outputIndex}_StreamProtocol`)
                                }
                                items={{
                                    0: "RTP",
                                    1: "UDP",
                                }}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "IP Address",
                        value: (
                            <BugTextfield
                                value={codecdata?.[`outputs_${outputIndex}_StreamIpv4DstAddress`]}
                                onChange={(event) =>
                                    onChange(event.target.value, `outputs_${outputIndex}_StreamIpv4DstAddress`)
                                }
                                // filter={/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}/}
                            />
                        ),
                    },
                    {
                        name: "Port",
                        value: (
                            <BugTextfield
                                value={codecdata?.[`outputs_${outputIndex}_StreamPortNumber`]}
                                onChange={(event) =>
                                    onChange(parseInt(event.target.value), `outputs_${outputIndex}_StreamPortNumber`)
                                }
                                filter={/[^0-9]/}
                                min={1}
                                max={65531}
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "TTL",
                        value: (
                            <BugTextfield
                                value={codecdata?.[`outputs_${outputIndex}_StreamOutputIpv4Ttl`]}
                                onChange={(event) =>
                                    onChange(parseInt(event.target.value), `outputs_${outputIndex}_StreamOutputIpv4Ttl`)
                                }
                                filter={/[^0-9]/}
                                min={1}
                                max={255}
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "TOS",
                        value: (
                            <BugSelect
                                value={codecdata?.[`outputs_${outputIndex}_StreamOutputIpv4Tos`]}
                                onChange={(event) =>
                                    onChange(parseInt(event.target.value), `outputs_${outputIndex}_StreamOutputIpv4Tos`)
                                }
                                items={{
                                    0: "None",
                                    104: "DSCP 26",
                                }}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Interface",
                        value: (
                            <BugSelect
                                value={codecdata?.[`outputs_${outputIndex}_StreamTransmitInterface`]}
                                onChange={(event) =>
                                    onChange(
                                        parseInt(event.target.value),
                                        `outputs_${outputIndex}_StreamTransmitInterface`
                                    )
                                }
                                items={{
                                    0: "GbE",
                                    1: "FE",
                                    2: "PPPoE1",
                                    3: "PPPoE2",
                                }}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Error Correction",
                        value: (
                            <BugSelect
                                value={codecdata?.[`outputs_${outputIndex}_StreamErrorCorrectionMode`]}
                                onChange={(event) =>
                                    onChange(
                                        parseInt(event.target.value),
                                        `outputs_${outputIndex}_StreamErrorCorrectionMode`
                                    )
                                }
                                items={{
                                    0: "None",
                                    1: "FEC",
                                    2: "ARQ",
                                }}
                            ></BugSelect>
                        ),
                    },
                    codecdata?.[`outputs_${outputIndex}_StreamErrorCorrectionMode`] > 0 && {
                        name: "FEC Columns",
                        value: (
                            <BugTextfield
                                value={codecdata?.[`outputs_${outputIndex}_StreamErrFecColumnNumber`]}
                                onChange={(event) =>
                                    onChange(
                                        parseInt(event.target.value),
                                        `outputs_${outputIndex}_StreamErrFecColumnNumber`
                                    )
                                }
                                filter={/[^0-9]/}
                                min={1}
                                max={20}
                            />
                        ),
                    },
                    codecdata?.[`outputs_${outputIndex}_StreamErrorCorrectionMode`] > 0 && {
                        name: "FEC Rows",
                        value: (
                            <BugTextfield
                                value={codecdata?.[`outputs_${outputIndex}_StreamErrFecRowNumber`]}
                                onChange={(event) =>
                                    onChange(
                                        parseInt(event.target.value),
                                        `outputs_${outputIndex}_StreamErrFecRowNumber`
                                    )
                                }
                                filter={/[^0-9]/}
                                min={4}
                                max={20}
                            />
                        ),
                    },
                ]}
            />
        </>
    );
}
