import React, { useContext } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { useForm } from "react-hook-form";
import ChipInput from "@core/ChipInput";
import PanelConfig from "@core/PanelConfig";
import Loading from "@components/Loading";
import { useSelector } from "react-redux";
import PasswordTextField from "@core/PasswordTextField";

export default function EditPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();

    if (panelConfig.status === "loading") {
        return <Loading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    return (
        <>
            <PanelConfig config={panelConfig.data} handleSubmit={handleSubmit}>
                <Grid item xs={12}>
                    <TextField
                        inputProps={{ ...register("title", { required: true }) }}
                        variant="filled"
                        required
                        fullWidth
                        error={errors?.title ? true : false}
                        defaultValue={panelConfig.data.title}
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
                        defaultValue={panelConfig.data.description}
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
                        defaultValue={panelConfig.data.address}
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
                        defaultValue={panelConfig.data.username}
                        type="text"
                        label="Username"
                    />
                </Grid>

                <Grid item xs={12} lg={6}>
                    <PasswordTextField
                        inputProps={{ ...register("password", { required: true }) }}
                        variant="filled"
                        fullWidth
                        error={errors?.password ? true : false}
                        defaultValue={panelConfig.data.password}
                        type="password"
                        label="Password"
                    />
                </Grid>

                <Grid item xs={12}>
                    <ChipInput
                        name="protectedInterfaces"
                        label="Protected Interfaces"
                        control={control}
                        defaultValue={panelConfig.data.protectedInterfaces}
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
                        defaultValue={panelConfig.data.excludedInterfaces}
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
