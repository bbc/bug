import React from "react";
import Grid from "@mui/material/Grid";
import ConfigFormTextField from "@core/ConfigFormTextField";
import ConfigFormChipInput from "@core/ConfigFormChipInput";
import ConfigFormSwitch from "@core/ConfigFormSwitch";
import BugConfigWrapper from "@core/BugConfigWrapper";
import Loading from "@components/Loading";
import { useSelector } from "react-redux";
import ConfigFormPanelGroup from "@core/ConfigFormPanelGroup";
import { useConfigFormHandler } from "@core/ConfigFormHandler";

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
                    <ConfigFormTextField
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
                    <ConfigFormTextField
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
                    <ConfigFormPanelGroup name="group" control={control} defaultValue={panelConfig.data.group} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <ConfigFormTextField
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
                        onChange={(event) => validateServer(event, "address", ["port"])}
                        type="text"
                        label="IP Address"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <ConfigFormTextField
                        //REGEX: Tests for IPv4 Port
                        inputProps={{
                            ...register("port", {
                                required: true,
                                pattern:
                                    /^()([1-9]|[1-5]?[0-9]{2,4}|6[1-4][0-9]{3}|65[1-4][0-9]{2}|655[1-2][0-9]|6553[1-5])$/,
                            }),
                        }}
                        fullWidth
                        error={errors.port}
                        helperText={messages.port}
                        defaultValue={panelConfig.data.port}
                        onChange={(event) => validateServer(event, "port", ["address"])}
                        type="text"
                        label="Device Port"
                    />
                </Grid>
                <Grid item xs={12}>
                    <ConfigFormSwitch
                        name="useTake"
                        label="Require double-click to take"
                        control={control}
                        defaultValue={panelConfig.data.useTake}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <ConfigFormChipInput
                        name="excludeSources"
                        label="Excluded Sources (0-based)"
                        control={control}
                        defaultValue={panelConfig.data.excludeSources}
                        sort={true}
                        error={errors.excludeSources}
                        fullWidth
                    />
                </Grid>
                {/*<Grid item xs={12}>
                    <ConfigFormChipInput
                        name="excludeDestinations"
                        label="Excluded Destinations (0-based)"
                        control={control}
                        defaultValue={panelConfig.data.excludeDestinations}
                        sort={true}
                        error={errors.excludeDestinations}
                        fullWidth
                    />
                </Grid> */}
            </BugConfigWrapper>
        </>
    );
}
