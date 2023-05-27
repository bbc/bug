import React from "react";
import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";
import BugTextField from "@core/BugTextField";
import Switch from "@mui/material/Switch";
import BugCodecAutocomplete from "@core/BugCodecAutocomplete";

export default function CodecVideo({
    codecdata,
    onChange,
    outputIndex,
    showAdvanced,
    collapsed,
    panelId,
    showCodecDropdown,
}) {
    return (
        <>
            <BugDetailsCard
                collapsible
                collapsed={collapsed}
                title={`Output ${outputIndex + 1}`}
                width="11rem"
                items={[
                    {
                        name: "Transmit",
                        value: (
                            <Switch
                                checked={codecdata?.[`outputs_${outputIndex}_StreamTransmission`] === 0}
                                onChange={(event) =>
                                    onChange({
                                        [`outputs_${outputIndex}_StreamTransmission`]: event.target.checked ? 0 : 1,
                                    })
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
                                    onChange({
                                        [`outputs_${outputIndex}_StreamProtocol`]: parseInt(event.target.value),
                                    })
                                }
                                options={[
                                    { id: 0, label: "RTP" },
                                    { id: 1, label: "UDP" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    showCodecDropdown && {
                        name: "Codec",
                        value: (
                            <BugCodecAutocomplete
                                addressValue={codecdata?.[`outputs_${outputIndex}_StreamIpv4DstAddress`]}
                                portValue={codecdata?.[`outputs_${outputIndex}_StreamPortNumber`]}
                                apiUrl={`/container/${panelId}/codecdb`}
                                capability={codecdata?.[`outputs_${outputIndex}_StreamProtocol`] === 0 ? "rtp" : "udp"}
                                onChange={(event, codec) => {
                                    onChange({
                                        [`outputs_${outputIndex}_StreamIpv4DstAddress`]: codec.address,
                                        [`outputs_${outputIndex}_StreamPortNumber`]: codec.port,
                                    });
                                }}
                            />
                        ),
                    },
                    {
                        name: "IP Address",
                        value: (
                            <BugTextField
                                changeOnBlur
                                value={codecdata?.[`outputs_${outputIndex}_StreamIpv4DstAddress`]}
                                onChange={(event) =>
                                    onChange({ [`outputs_${outputIndex}_StreamIpv4DstAddress`]: event.target.value })
                                }
                            />
                        ),
                    },
                    {
                        name: "Port",
                        value: (
                            <BugTextField
                                changeOnBlur
                                value={codecdata?.[`outputs_${outputIndex}_StreamPortNumber`]}
                                onChange={(event) =>
                                    onChange({
                                        [`outputs_${outputIndex}_StreamPortNumber`]: parseInt(event.target.value),
                                    })
                                }
                                filter={/[^0-9]/}
                                numeric
                                min={1}
                                max={65531}
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "TTL",
                        value: (
                            <BugTextField
                                changeOnBlur
                                value={codecdata?.[`outputs_${outputIndex}_StreamOutputIpv4Ttl`]}
                                onChange={(event) =>
                                    onChange({
                                        [`outputs_${outputIndex}_StreamOutputIpv4Ttl`]: parseInt(event.target.value),
                                    })
                                }
                                filter={/[^0-9]/}
                                numeric
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
                                    onChange({
                                        [`outputs_${outputIndex}_StreamOutputIpv4Tos`]: parseInt(event.target.value),
                                    })
                                }
                                options={[
                                    { id: 0, label: "None" },
                                    { id: 104, label: "DSCP 26" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Interface",
                        value: (
                            <BugSelect
                                value={codecdata?.[`outputs_${outputIndex}_StreamTransmitInterface`]}
                                onChange={(event) =>
                                    onChange({
                                        [`outputs_${outputIndex}_StreamTransmitInterface`]: parseInt(
                                            event.target.value
                                        ),
                                    })
                                }
                                options={[
                                    { id: 0, label: "GbE" },
                                    { id: 1, label: "FE" },
                                    { id: 2, label: "PPPoE1" },
                                    { id: 3, label: "PPPoE2" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Error Correction",
                        value: (
                            <BugSelect
                                value={codecdata?.[`outputs_${outputIndex}_StreamErrorCorrectionMode`]}
                                onChange={(event) =>
                                    onChange({
                                        [`outputs_${outputIndex}_StreamErrorCorrectionMode`]: parseInt(
                                            event.target.value
                                        ),
                                    })
                                }
                                options={[
                                    { id: 0, label: "None" },
                                    { id: 1, label: "FEC" },
                                    { id: 2, label: "ARQ" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    codecdata?.[`outputs_${outputIndex}_StreamErrorCorrectionMode`] > 0 && {
                        name: "FEC Columns",
                        value: (
                            <BugTextField
                                changeOnBlur
                                value={codecdata?.[`outputs_${outputIndex}_StreamErrFecColumnNumber`]}
                                onChange={(event) =>
                                    onChange({
                                        [`outputs_${outputIndex}_StreamErrFecColumnNumber`]: parseInt(
                                            event.target.value
                                        ),
                                    })
                                }
                                filter={/[^0-9]/}
                                numeric
                                min={1}
                                max={20}
                            />
                        ),
                    },
                    codecdata?.[`outputs_${outputIndex}_StreamErrorCorrectionMode`] > 0 && {
                        name: "FEC Rows",
                        value: (
                            <BugTextField
                                changeOnBlur
                                value={codecdata?.[`outputs_${outputIndex}_StreamErrFecRowNumber`]}
                                onChange={(event) =>
                                    onChange({
                                        [`outputs_${outputIndex}_StreamErrFecRowNumber`]: parseInt(event.target.value),
                                    })
                                }
                                filter={/[^0-9]/}
                                numeric
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
