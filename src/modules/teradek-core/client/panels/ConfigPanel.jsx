import React from "react";
import Grid from "@mui/material/Grid";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugConfigWrapper from "@core/BugConfigWrapper";
import BugLoading from "@core/BugLoading";
import { useSelector } from "react-redux";
import BugConfigFormPasswordTextField from "@core/BugConfigFormPasswordTextField";
import BugConfigFormPanelGroup from "@core/BugConfigFormPanelGroup";
import { useConfigFormHandler } from "@hooks/ConfigFormHandler";
import BugConfigFormAutocomplete from "@core/BugConfigFormAutocomplete";
import { useApiPoller } from "@hooks/ApiPoller";
import { useParams } from "react-router-dom";

export default function ConfigPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);
    const params = useParams();
    const panelId = params.panelId;

    const decoders = useApiPoller({
        url: `/container/${panelId}/decoder/`,
        interval: 10000,
    });

    const encoders = useApiPoller({
        url: `/container/${panelId}/encoder/`,
        interval: 10000,
    });

    if (panelConfig.status === "loading") {
        return <BugLoading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    const { register, handleSubmit, control, errors, validateServer, messages } = useConfigFormHandler({
        panelId: panelConfig.data.id,
    });

    let validatedEncoders = [];
    if (encoders.status === "success" && encoders.data && encoders.data.length > 0) {
        validatedEncoders = encoders.data;
    }

    let validatedDecoders = [];
    if (decoders.status === "success" && decoders.data && decoders.data.length > 0) {
        validatedDecoders = decoders.data;
    }

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

                <Grid item xs={6}>
                    <BugConfigFormTextField
                        name="username"
                        control={control}
                        rules={{ required: true }}
                        fullWidth
                        error={errors?.username ? true : false}
                        defaultValue={panelConfig.data.username}
                        label="Email"
                    />
                </Grid>

                <Grid item xs={12}>
                    <BugConfigFormAutocomplete
                        name="encoders"
                        label="Encoders to Monitor"
                        control={control}
                        defaultValue={panelConfig.data.encoders}
                        options={validatedEncoders}
                        error={errors.encoders}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12}>
                    <BugConfigFormAutocomplete
                        name="decoders"
                        label="Decoders to Monitor"
                        control={control}
                        defaultValue={panelConfig.data.decoders}
                        options={validatedDecoders}
                        error={errors.decoders}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={6}>
                    <BugConfigFormPasswordTextField
                        name="password"
                        control={control}
                        rules={{ required: true }}
                        fullWidth
                        error={errors?.password ? true : false}
                        defaultValue={panelConfig.data.password}
                        type="password"
                        label="Password"
                    />
                </Grid>

                <Grid item xs={6}>
                    <BugConfigFormTextField
                        name="organisation"
                        control={control}
                        rules={{ required: true }}
                        fullWidth
                        error={errors?.organisation ? true : false}
                        defaultValue={panelConfig.data.organisation}
                        label="Teradek Core Organisation Name"
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <BugConfigFormPanelGroup name="group" control={control} defaultValue={panelConfig.data.group} />
                </Grid>
            </BugConfigWrapper>
        </>
    );
}
