import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import PanelConfig from "@core/PanelConfig";
import Loading from "@components/Loading";
import { useSelector } from "react-redux";
import PasswordTextField from "@core/PasswordTextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import PanelGroupFormControl from "@core/PanelGroupFormControl";
import { useConfigFormHandler } from "@core/ConfigFormHandler";

export default function ConfigPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);

    if (panelConfig.status === "loading") {
        return <Loading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    const {
        register,
        handleSubmit,
        control,
        errors,
        validateServer,
        messages,
    } = useConfigFormHandler({
        panelId: panelConfig.data.id,
    });

    return (
        <>
            <PanelConfig config={panelConfig.data} handleSubmit={handleSubmit}>
                <Grid item xs={12}>
                    <TextField
                        inputProps={{
                            ...register("title", { required: true }),
                        }}
                        variant="filled"
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
                                pattern:
                                    /((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}/,
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

                <Grid item xs={6}>
                    <TextField
                        inputProps={{
                            ...register("username", { required: true }),
                        }}
                        variant="filled"
                        fullWidth
                        error={errors?.username ? true : false}
                        defaultValue={panelConfig.data.username}
                        type="text"
                        label="Web Interface Username"
                    />
                </Grid>

                <Grid item xs={6}>
                    <PasswordTextField
                        inputProps={{
                            ...register("password", { required: true }),
                        }}
                        variant="filled"
                        fullWidth
                        error={errors?.password ? true : false}
                        defaultValue={panelConfig.data.password}
                        type="password"
                        label="Web Interface Password"
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        inputProps={{
                            ...register("outputs", { required: true }),
                            step: "any",
                        }}
                        variant="filled"
                        fullWidth
                        error={errors?.outputs ? true : false}
                        defaultValue={panelConfig.data.outputs}
                        type="number"
                        label="Outputs"
                    />
                </Grid>

                <Grid item xs={6}>
                    <FormControl variant="filled" fullWidth>
                        <InputLabel>Model</InputLabel>
                        <Select
                            native
                            defaultValue={panelConfig.data.model}
                            label="Model"
                            error={errors?.model ? true : false}
                            inputProps={{
                                ...register("model", { required: true }),
                            }}
                        >
                            <option value={"tsl-mdu-12-pm"}>
                                TSL MDU 12 PM
                            </option>
                            <option value={"tsl-mdu-3es"}>TSL MDU 3ES</option>
                            <option value={"tsl-mdu-3es"}>TSL MDU 3ES</option>
                        </Select>
                    </FormControl>
                </Grid>
            </PanelConfig>
        </>
    );
}