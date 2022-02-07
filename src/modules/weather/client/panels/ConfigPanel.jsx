import React from "react";
import Grid from "@mui/material/Grid";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugConfigWrapper from "@core/BugConfigWrapper";
import Loading from "@components/Loading";
import { useSelector } from "react-redux";
import { useConfigFormHandler } from "@hooks/ConfigFormHandler";
import BugConfigFormSelect from "@core/BugConfigFormSelect";
import BugConfigFormPanelGroup from "@core/BugConfigFormPanelGroup";

export default function ConfigPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);

    const { register, handleSubmit, control, errors, validateServer, messages } = useConfigFormHandler({
        panelId: panelConfig.data.id,
    });

    if (panelConfig.status === "loading") {
        return <Loading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    return (
        <BugConfigWrapper config={panelConfig.data} handleSubmit={handleSubmit}>
            <Grid item xs={12}>
                <BugConfigFormTextField
                    name="title"
                    control={control}
                    rules={{ required: true }}
                    fullWidth
                    error={errors.title}
                    defaultValue={panelConfig.data.title}
                    type="text"
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
                    type="text"
                    label="Description"
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <BugConfigFormPanelGroup name="group" control={control} defaultValue={panelConfig.data.group} />
            </Grid>

            <Grid item xs={12} md={6}>
                <BugConfigFormTextField
                    name="label"
                    control={control}
                    rules={{ required: true }}
                    fullWidth
                    error={errors?.label ? true : false}
                    defaultValue={panelConfig.data.label}
                    type="text"
                    label="Location Name"
                />
            </Grid>

            <Grid item xs={12}>
                <BugConfigFormTextField
                    name="openweather_key"
                    control={control}
                    rules={{ required: true }}
                    fullWidth
                    error={errors?.openweather_key ? true : false}
                    defaultValue={panelConfig.data.openweather_key}
                    type="text"
                    label="OpenWeather API Key"
                />
            </Grid>

            <Grid item xs={6}>
                <BugConfigFormTextField
                    name="latitude"
                    control={control}
                    rules={{ required: true }}
                    min={-90}
                    max={90}
                    numeric={true}
                    fullWidth
                    error={errors?.latitude}
                    defaultValue={panelConfig.data.latitude}
                    type="number"
                    label="Location Latitude"
                />
            </Grid>

            <Grid item xs={6}>
                <BugConfigFormTextField
                    name="longitude"
                    control={control}
                    rules={{ required: true }}
                    min={-90}
                    max={90}
                    numeric={true}
                    fullWidth
                    error={errors?.longitude ? true : false}
                    defaultValue={panelConfig.data.longitude}
                    type="number"
                    label="Location Longitude"
                    step="any"
                />
            </Grid>

            <Grid item xs={6}>
                <BugConfigFormSelect
                    name="length"
                    control={control}
                    fullWidth
                    error={errors?.length}
                    defaultValue={panelConfig.data.length}
                    label="Forecast Length"
                    rules={{ required: true }}
                    items={{
                        today: "Today Only",
                        week: "5 Day Forecast",
                    }}
                />
            </Grid>

            <Grid item xs={6}>
                <BugConfigFormSelect
                    name="units"
                    control={control}
                    fullWidth
                    error={errors?.units ? true : false}
                    defaultValue={panelConfig.data.units}
                    label="Units"
                    rules={{ required: true }}
                    items={{
                        metric: "Metric",
                        standard: "Standard",
                        imperial: "Imperial",
                    }}
                />
            </Grid>
        </BugConfigWrapper>
    );
}
