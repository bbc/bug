import BugConfigFormPanelGroup from "@core/BugConfigFormPanelGroup";
import BugConfigFormSelect from "@core/BugConfigFormSelect";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugConfigWrapper from "@core/BugConfigWrapper";
import BugLoading from "@core/BugLoading";
import { useConfigFormHandler } from "@hooks/ConfigFormHandler";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";

export default function ConfigPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);

    const { register, handleSubmit, control, errors, validateServer, messages } = useConfigFormHandler({
        panelId: panelConfig.data.id,
    });

    if (panelConfig.status === "loading") {
        return <BugLoading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    return (
        <BugConfigWrapper config={panelConfig.data} handleSubmit={handleSubmit}>
            <Grid size={{ xs: 12 }}>
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
            <Grid size={{ xs: 12 }}>
                <BugConfigFormTextField
                    name="description"
                    control={control}
                    fullWidth
                    error={errors.description}
                    defaultValue={panelConfig.data.description}
                    label="Description"
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <BugConfigFormPanelGroup name="group" control={control} defaultValue={panelConfig.data.group} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <BugConfigFormTextField
                    name="label"
                    control={control}
                    rules={{ required: true }}
                    fullWidth
                    error={errors?.label}
                    defaultValue={panelConfig.data.label}
                    label="Location Name"
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <BugConfigFormTextField
                    name="openweather_key"
                    control={control}
                    rules={{ required: true }}
                    fullWidth
                    error={errors?.openweather_key}
                    defaultValue={panelConfig.data.openweather_key}
                    label="OpenWeather API Key"
                />
            </Grid>

            <Grid size={{ xs: 6 }}>
                <BugConfigFormTextField
                    name="latitude"
                    control={control}
                    rules={{ required: true }}
                    inputProps={{ inputmode: "decimal", max: 90, min: -90, step: "0.01" }}
                    type="number"
                    fullWidth
                    error={errors?.latitude}
                    defaultValue={panelConfig.data.latitude}
                    label="Location Latitude"
                />
            </Grid>

            <Grid size={{ xs: 6 }}>
                <BugConfigFormTextField
                    name="longitude"
                    control={control}
                    rules={{ required: true }}
                    inputProps={{ inputmode: "decimal", max: 90, min: -90, step: "0.01" }}
                    type="number"
                    fullWidth
                    error={errors?.longitude}
                    defaultValue={panelConfig.data.longitude}
                    label="Location Longitude"
                />
            </Grid>

            <Grid size={{ xs: 6 }}>
                <BugConfigFormSelect
                    name="length"
                    control={control}
                    fullWidth
                    error={errors?.length}
                    defaultValue={panelConfig.data.length}
                    label="Forecast Length"
                    rules={{ required: true }}
                    options={[
                        { id: "today", label: "Today Only" },
                        { id: "week", label: "5 Day Forecast" },
                    ]}
                />
            </Grid>

            <Grid size={{ xs: 6 }}>
                <BugConfigFormSelect
                    name="units"
                    control={control}
                    fullWidth
                    error={errors?.units}
                    defaultValue={panelConfig.data.units}
                    label="Units"
                    rules={{ required: true }}
                    options={[
                        { id: "metric", label: "Metric" },
                        { id: "standard", label: "Standard" },
                        { id: "imperial", label: "Imperial" },
                    ]}
                />
            </Grid>
        </BugConfigWrapper>
    );
}
