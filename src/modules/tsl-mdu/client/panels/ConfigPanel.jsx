import React from "react";
import Grid from "@mui/material/Grid";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugConfigWrapper from "@core/BugConfigWrapper";
import Loading from "@components/Loading";
import { useSelector } from "react-redux";
import BugPasswordTextField from "@core/BugPasswordTextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import BugConfigFormPanelGroup from "@core/BugConfigFormPanelGroup";
import { useConfigFormHandler } from "@hooks/ConfigFormHandler";
import BugConfigFormSelect from "@core/BugConfigFormSelect";

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
                        inputProps={{
                            ...register("title", { required: true }),
                        }}
                        fullWidth
                        error={errors?.title ? true : false}
                        defaultValue={panelConfig.data.title}
                        type="text"
                        label="Panel Title"
                    />
                </Grid>

                <Grid item xs={12}>
                    <BugConfigFormTextField
                        inputProps={{ ...register("description") }}
                        fullWidth
                        error={errors?.description ? true : false}
                        defaultValue={panelConfig.data.description}
                        type="text"
                        label="Description"
                    />
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
                        error={errors?.address ? true : false}
                        defaultValue={panelConfig.data.address}
                        type="text"
                        label="IP Address"
                    />
                </Grid>

                <Grid item xs={6}>
                    <BugConfigFormTextField
                        inputProps={{
                            ...register("username", { required: true }),
                        }}
                        fullWidth
                        error={errors?.username ? true : false}
                        defaultValue={panelConfig.data.username}
                        type="text"
                        label="Web Interface Username"
                    />
                </Grid>

                <Grid item xs={6}>
                    <BugPasswordTextField
                        inputProps={{
                            ...register("password", { required: true }),
                        }}
                        fullWidth
                        error={errors?.password ? true : false}
                        defaultValue={panelConfig.data.password}
                        type="password"
                        label="Web Interface Password"
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <BugConfigFormPanelGroup name="group" control={control} defaultValue={panelConfig.data.group} />
                </Grid>

                <Grid item xs={6}>
                    <BugConfigFormSelect
                        inputProps={{ ...register("model", { required: true }) }}
                        fullWidth
                        error={errors?.model ? true : false}
                        defaultValue={panelConfig.data.model}
                        label="Model"
                        items={{
                            "tsl-mdu-12-pm": "TSL MDU 12 PM",
                            "tsl-mdu-3es": "TSL MDU 3ES",
                        }}
                    />
                </Grid>
            </BugConfigWrapper>
        </>
    );
}
