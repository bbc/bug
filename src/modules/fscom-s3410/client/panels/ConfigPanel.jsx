import React from "react";
import Grid from "@mui/material/Grid";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugConfigFormPasswordTextField from "@core/BugConfigFormPasswordTextField";
import BugLoading from "@core/BugLoading";
import { useSelector } from "react-redux";
import BugConfigFormPanelGroup from "@core/BugConfigFormPanelGroup";
import { useConfigFormHandler } from "@hooks/ConfigFormHandler";
import BugConfigWrapper from "@core/BugConfigWrapper";
import BugConfigFormChipInput from "@core/BugConfigFormChipInput";
import BugConfigFormMultiPanelSelect from "@core/BugConfigFormMultiPanelSelect";

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
                        label="IP Address or FQDN"
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
                    <BugConfigFormChipInput
                        name="protectedInterfaces"
                        label="Protected Interfaces"
                        control={control}
                        defaultValue={panelConfig.data.protectedInterfaces}
                        sort={true}
                        error={errors.protectedInterfaces}
                        helperText="Full interface ID, short ID or wildcard eg: gi1/1*"
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12}>
                    <BugConfigFormMultiPanelSelect
                        name="dhcpSources"
                        label="DHCP Source Devices"
                        control={control}
                        defaultValue={panelConfig.data.dhcpSources}
                        error={errors.dhcpSources}
                        helperText="Select one or more devices for DHCP lookup information"
                        fullWidth
                        capability="dhcp-server"
                    />
                </Grid>
            </BugConfigWrapper>
        </>
    );
}