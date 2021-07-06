import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import PanelConfig from "@core/PanelConfig";
import Loading from "@components/Loading";
import { useSelector } from "react-redux";
import PasswordTextField from "@core/PasswordTextField";
import PanelGroupFormControl from "@core/PanelGroupFormControl";
import { useConfigFormHandler } from "@core/ConfigFormHandler";
import ConfigFormChipInputAutocomplete from "@core/ConfigFormChipInputAutocomplete";
import AxiosGet from "@utils/AxiosGet";

export default function ConfigPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        const filterDevices = async () => {
            const devices = await AxiosGet(`/container/${panelConfig.data.id}/device/all`);
            const filteredDevices = await devices.map((device) => {
                return { sid: device?.sid, name: device?.name, type: device?.type };
            });
            setDevices(filteredDevices);
        };
        filterDevices();
    }, [panelConfig?.data?.id]);

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
                    <TextField
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
                    <TextField
                        inputProps={{ ...register("description") }}
                        fullWidth
                        error={errors?.description ? true : false}
                        defaultValue={panelConfig.data.description}
                        type="text"
                        label="Description"
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
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
                    <TextField
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

                <Grid item xs={12}>
                    <ConfigFormChipInputAutocomplete
                        name="encoders"
                        label="Encoders to Monitor"
                        control={control}
                        defaultValue={panelConfig.data.encoders}
                        acData={devices.filter((device) => device?.type === "encoder")}
                        acTextKey="name"
                        error={errors.encoders}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12}>
                    <ConfigFormChipInputAutocomplete
                        name="decoders"
                        label="Decoders to Monitor"
                        control={control}
                        defaultValue={panelConfig.data.decoders}
                        acData={devices.filter((device) => device?.type === "decoder")}
                        acTextKey="name"
                        error={errors.decoders}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <PanelGroupFormControl name="group" control={control} defaultValue={panelConfig.data.group} />
                </Grid>
            </PanelConfig>
        </>
    );
}
