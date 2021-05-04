import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { useForm } from "react-hook-form";
import ChipInput from '@core/ChipInput';
import PanelConfig from "@core/PanelConfig";
import Loading from "@components/Loading";
import useAsyncEffect from 'use-async-effect';
import { useParams } from "react-router-dom";
import AxiosGet from "@utils/AxiosGet";

export default function EditPanel() {
    const params = useParams();
    const [config, setConfig] = React.useState(null);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();

    useAsyncEffect(async () => {
        setConfig(await AxiosGet(`/api/panelconfig/${params.panelId}`));
    }, []);

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

                <Grid item xs={12}>
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

                <Grid item xs={12}>
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
                        id="protected_interfaces"
                        name="protected_interfaces"
                        label="Protected Interfaces"
                        control={control}
                        defaultValue={config?.protected_interfaces}
                        variant="filled"
                        error={errors.protected_interfaces ? true : false}
                    />
                </Grid>

                <Grid item xs={12}>
                    <ChipInput
                        id="excluded_interfaces"
                        name="excluded_interfaces"
                        label="Excluded Interfaces"
                        control={control}
                        defaultValue={config?.excluded_interfaces}
                        variant="filled"
                        error={errors.excluded_interfaces ? true : false}
                    />
                </Grid>
            </PanelConfig>
        </>
    );
}
