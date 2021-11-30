import React from "react";
import Grid from "@mui/material/Grid";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import Loading from "@components/Loading";
import { useSelector } from "react-redux";
import BugConfigFormPanelGroup from "@core/BugConfigFormPanelGroup";
import { useConfigFormHandler } from "@hooks/ConfigFormHandler";
import BugConfigWrapper from "@core/BugConfigWrapper";
import BugConfigFormChipInput from "@core/BugConfigFormChipInput";
import BugConfigFormPanelSelect from "@core/BugConfigFormPanelSelect";

export default function ConfigPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);

    if (panelConfig.status === "loading") {
        return <Loading />;
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
                        inputProps={{ ...register("title", { required: true }) }}
                        required
                        fullWidth
                        error={errors.title}
                        defaultValue={panelConfig.data.title}
                        type="text"
                        label="Panel Title"
                    />
                </Grid>

                <Grid item xs={12}>
                    <BugConfigFormTextField
                        inputProps={{ ...register("description") }}
                        fullWidth
                        error={errors.description}
                        defaultValue={panelConfig.data.description}
                        variant="standard"
                        type="text"
                        label="Description"
                    />
                </Grid>
                <Grid item xs={12}>
                    <BugConfigFormPanelGroup name="group" control={control} defaultValue={panelConfig.data.group} />
                </Grid>

                <Grid item xs={12}>
                    <BugConfigFormTextField
                        //REGEX: Tests for IPv4 Addresses
                        inputProps={{
                            ...register("address", {
                                required: true,
                                pattern: /((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}/,
                            }),
                        }}
                        fullWidth
                        error={errors.address}
                        helperText={messages.address}
                        defaultValue={panelConfig.data.address}
                        onChange={(event) => validateServer(event, "address")}
                        type="text"
                        label="IP Address"
                    />
                </Grid>

                <Grid item xs={6}>
                    <BugConfigFormTextField
                        inputProps={{ ...register("username", { required: true }) }}
                        fullWidth
                        variant="standard"
                        error={errors?.username}
                        helperText={messages.username}
                        defaultValue={panelConfig.data.username}
                        onChange={(event) => validateServer(event, "username", ["address", "password"])}
                        type="text"
                        label="SSH Username"
                    />
                </Grid>

                <Grid item xs={6}>
                    <BugConfigFormTextField
                        inputProps={{ ...register("password", { required: true }) }}
                        fullWidth
                        variant="standard"
                        error={errors?.password}
                        helperText={messages.password}
                        defaultValue={panelConfig.data.password}
                        onChange={(event) => validateServer(event, "password", ["address", "username"])}
                        type="password"
                        label="SSH Password"
                    />
                </Grid>

                <Grid item xs={12}>
                    <BugConfigFormTextField
                        inputProps={{ ...register("snmpCommunity", { required: true }) }}
                        fullWidth
                        error={errors.snmpCommunity}
                        helperText={messages.snmpCommunity}
                        defaultValue={panelConfig.data.snmpCommunity}
                        onChange={(event) => validateServer(event, "snmpCommunity", ["address"])}
                        type="text"
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
                    <BugConfigFormPanelSelect
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
