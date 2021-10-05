import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import ConfigFormTextField from "@core/ConfigFormTextField";
import PanelConfig from "@core/PanelConfig";
import Loading from "@components/Loading";
import { useSelector } from "react-redux";
import PasswordTextField from "@core/PasswordTextField";
import PanelGroupFormControl from "@core/PanelGroupFormControl";
import { useConfigFormHandler } from "@core/ConfigFormHandler";
import ConfigFormAutocomplete from "@core/ConfigFormAutocomplete";
import AxiosGet from "@utils/AxiosGet";
import useAsyncEffect from "use-async-effect";

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
            <PanelConfig config={panelConfig.data} handleSubmit={handleSubmit}>
                <Grid item xs={12}>
                    <ConfigFormTextField
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
                    <ConfigFormTextField
                        inputProps={{ ...register("description") }}
                        fullWidth
                        error={errors?.description ? true : false}
                        defaultValue={panelConfig.data.description}
                        type="text"
                        label="Description"
                    />
                </Grid>

                <Grid item xs={6}>
                    <ConfigFormTextField
                        inputProps={{
                            ...register("username", { required: true }),
                        }}
                        fullWidth
                        error={errors?.username ? true : false}
                        defaultValue={panelConfig.data.username}
                        type="text"
                        label="Email"
                    />
                </Grid>

                <Grid item xs={6}>
                    <PasswordTextField
                        inputProps={{
                            ...register("password", { required: true }),
                        }}
                        fullWidth
                        error={errors?.password ? true : false}
                        defaultValue={panelConfig.data.password}
                        type="password"
                        label="Password"
                    />
                </Grid>

                <Grid item xs={6}>
                    <ConfigFormTextField
                        inputProps={{
                            ...register("organisation", { required: true }),
                        }}
                        fullWidth
                        error={errors?.organisation ? true : false}
                        defaultValue={panelConfig.data.organisation}
                        type="text"
                        label="Teradek Core Organisation Name"
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <PanelGroupFormControl name="group" control={control} defaultValue={panelConfig.data.group} />
                </Grid>
            </PanelConfig>
        </>
    );
}
