import React, { useContext } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { useForm } from "react-hook-form";
import ChipInput from "@core/ChipInput";
import PanelConfig from "@core/PanelConfig";
import Loading from "@components/Loading";
import PanelConfigContext from "@core/PanelConfigContext";

export default function EditPanel() {
    const config = useContext(PanelConfigContext);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();

    if (!config) {
        return <Loading />;
    }

    return (
        <>
            <PanelConfig config={config} handleSubmit={handleSubmit}>
                <Grid item xs={12}>
                    <TextField
                        inputProps={{ ...register("title", { required: true }) }}
                        variant="filled"
                        required
                        fullWidth
                        error={errors?.title ? true : false}
                        defaultValue={config?.title}
                        type="text"
                        label="Panel Title"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        inputProps={{ ...register("description") }}
                        variant="filled"
                        fullWidth
                        error={errors?.description ? true : false}
                        defaultValue={config?.description}
                        type="text"
                        label="Description"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        //REGEX: Tests for IPv4 Addresses
                        inputProps={{
                            ...register("address", {
                                required: true,
                                pattern: /((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}/,
                            }),
                        }}
                        variant="filled"
                        fullWidth
                        error={errors?.address ? true : false}
                        defaultValue={config?.address}
                        type="text"
                        label="IP Address"
                    />
                </Grid>

                <Grid item xs={12} lg={6}>
                    <TextField
                        inputProps={{ ...register("username", { required: true }) }}
                        variant="filled"
                        fullWidth
                        error={errors?.username ? true : false}
                        defaultValue={config?.username}
                        type="text"
                        label="Username"
                    />
                </Grid>

                <Grid item xs={12} lg={6}>
                    <TextField
                        inputProps={{ ...register("password", { required: true }) }}
                        variant="filled"
                        fullWidth
                        error={errors?.password ? true : false}
                        defaultValue={config?.password}
                        type="password"
                        label="Password"
                    />
                </Grid>

                <Grid item xs={12}>
                    <ChipInput
                        name="protectedInterfaces"
                        label="Protected Interfaces"
                        control={control}
                        defaultValue={config?.protectedInterfaces}
                        variant="filled"
                        sort={true}
                        error={errors.protectedInterfaces ? true : false}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12}>
                    <ChipInput
                        name="excludedInterfaces"
                        label="Excluded Interfaces"
                        control={control}
                        defaultValue={config?.excludedInterfaces}
                        variant="filled"
                        sort={true}
                        error={errors.excludedInterfaces ? true : false}
                        fullWidth
                    />
                </Grid>
            </PanelConfig>
        </>
    );
}
