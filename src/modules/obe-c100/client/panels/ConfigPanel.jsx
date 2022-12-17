import React from "react";
import Grid from "@mui/material/Grid";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugLoading from "@core/BugLoading";
import { useSelector } from "react-redux";
import BugConfigFormPanelGroup from "@core/BugConfigFormPanelGroup";
import { useConfigFormHandler } from "@hooks/ConfigFormHandler";
import BugConfigWrapper from "@core/BugConfigWrapper";
import BugConfigFormSelect from "@core/BugConfigFormSelect";
import BugConfigFormPanelSelect from "@core/BugConfigFormPanelSelect";

export default function ConfigPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);

    if (panelConfig.status === "loading") {
        return <BugLoading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    const { register, handleSubmit, control, errors, validateServer, messages } = useConfigFormHandler({
        panelId: panelConfig.data.id,
    });

    return (
        <>
            <BugConfigWrapper config={panelConfig.data} handleSubmit={handleSubmit}>
                <Grid item xs={12}>
                    <BugConfigFormTextField
                        name="title"
                        control={control}
                        rules={{ required: true }}
                        fullWidth
                        error={errors.title}
                        defaultValue={panelConfig.data.title}
                        label="Panel Title"
                    />
                </Grid>
                <Grid item xs={12}>
                    <BugConfigFormTextField
                        name="description"
                        control={control}
                        fullWidth
                        error={errors.description}
                        defaultValue={panelConfig.data.description}
                        label="Description"
                    />
                </Grid>
                <Grid item xs={12}>
                    <BugConfigFormPanelGroup name="group" control={control} defaultValue={panelConfig.data.group} />
                </Grid>

                <Grid item xs={12}>
                    <BugConfigFormTextField
                        name="address"
                        control={control}
                        rules={{ required: true }}
                        fullWidth
                        error={errors.address}
                        helperText={messages.address}
                        defaultValue={panelConfig.data.address}
                        supportsValidation
                        onChange={(event) => validateServer(event, "address")}
                        label="IP Address"
                    />
                </Grid>

                <Grid item xs={12}>
                    <BugConfigFormTextField
                        name="snmpCommunity"
                        control={control}
                        rules={{ required: true }}
                        fullWidth
                        error={errors.snmpCommunity}
                        helperText={messages.snmpCommunity}
                        defaultValue={panelConfig.data.snmpCommunity}
                        supportsValidation
                        onChange={(event) => validateServer(event, "snmpCommunity", ["address"])}
                        label="SNMP Community String"
                    />
                </Grid>

                <Grid item xs={12}>
                    <BugConfigFormSelect
                        name="encoderIndex"
                        control={control}
                        fullWidth
                        error={errors.encoderIndex}
                        helperText={messages.encoderIndex}
                        defaultValue={panelConfig.data.encoderIndex}
                        label="Encoder index (0-3)"
                        rules={{ required: true }}
                        options={[
                            { id: 0, label: "Encoder 0" },
                            { id: 1, label: "Encoder 1" },
                            { id: 2, label: "Encoder 2" },
                            { id: 3, label: "Encoder 3" },
                        ]}
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <BugConfigFormPanelSelect
                        name="codecSource"
                        label="Codec Database Source"
                        control={control}
                        defaultValue={panelConfig.data.codecSource ?? ""}
                        error={errors.codecSource}
                        helperText="Select a source of codec information"
                        fullWidth
                        capability="codec-db"
                    />
                </Grid>
            </BugConfigWrapper>
        </>
    );
}
