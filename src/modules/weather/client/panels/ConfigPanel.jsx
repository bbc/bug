import React, { useContext } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { useForm } from "react-hook-form";
import PanelConfig from "@core/PanelConfig";
import Loading from "@components/Loading";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useSelector } from "react-redux";

export default function ConfigPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    if (panelConfig.status === "loading") {
        return <Loading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    return (
        <PanelConfig config={panelConfig.data} handleSubmit={handleSubmit}>
            <Grid item xs={12}>
                <TextField
                    inputProps={{ ...register("title", { required: true }) }}
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

            <Grid item xs={12}>
                <TextField
                    inputProps={{ ...register("openweather_key", { required: true }) }}
                    fullWidth
                    error={errors?.openweather_key ? true : false}
                    defaultValue={panelConfig.data.openweather_key}
                    type="text"
                    label="OpenWeather API Key"
                />
            </Grid>

            <Grid item xs={12}>
                <TextField
                    inputProps={{ ...register("label", { required: true }) }}
                    fullWidth
                    error={errors?.label ? true : false}
                    defaultValue={panelConfig.data.label}
                    type="text"
                    label="Location Name"
                />
            </Grid>

            <Grid item xs={6}>
                <TextField
                    inputProps={{ ...register("longitude", { required: true }), step: "any" }}
                    fullWidth
                    error={errors?.longitude ? true : false}
                    defaultValue={panelConfig.data.longitude}
                    type="number"
                    label="Location Longitude"
                    step="any"
                />
            </Grid>

            <Grid item xs={6}>
                <TextField
                    inputProps={{ ...register("latitude", { required: true }), step: "any" }}
                    fullWidth
                    error={errors?.latitude ? true : false}
                    defaultValue={panelConfig.data.latitude}
                    type="number"
                    label="Location Latitude"
                />
            </Grid>

            <Grid item xs={6}>
                <FormControl fullWidth>
                    <InputLabel>Forecast Length</InputLabel>
                    <Select
                        native
                        defaultValue={panelConfig.data.length}
                        label="Forecast Length"
                        error={errors?.length ? true : false}
                        inputProps={{ ...register("length", { required: true }) }}
                    >
                        <option value={"today"}>Today Only</option>
                        <option value={"week"}>5 Day Forecast</option>
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={6}>
                <FormControl fullWidth>
                    <InputLabel>Units</InputLabel>
                    <Select
                        native
                        defaultValue={panelConfig.data.units}
                        label="Units"
                        error={errors?.units ? true : false}
                        inputProps={{ ...register("units", { required: true }) }}
                    >
                        <option value={"metric"}>Metric</option>
                        <option value={"standard"}>Standard</option>
                        <option value={"imperial"}>Imperial</option>
                    </Select>
                </FormControl>
            </Grid>
        </PanelConfig>
    );
}
