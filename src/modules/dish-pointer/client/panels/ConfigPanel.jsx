import React from "react";
import Grid from "@mui/material/Grid";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugConfigWrapper from "@core/BugConfigWrapper";
import BugLoading from "@core/BugLoading";
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
        return <BugLoading />;
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

            <Grid item xs={12} md={6}>
                <BugConfigFormPanelGroup name="group" control={control} defaultValue={panelConfig.data.group} />
            </Grid>

            <Grid item xs={6}>
                <BugConfigFormTextField
                    name="esLatitude"
                    control={control}
                    rules={{ required: true }}
                    inputProps={{ inputmode: "decimal", max: 90, min: -90, step: "0.01" }}
                    type="number"
                    fullWidth
                    error={errors?.esLatitude}
                    defaultValue={panelConfig.data.esLatitude}
                    label="Earth Station Latitude"
                />
            </Grid>

            <Grid item xs={6}>
                <BugConfigFormTextField
                    name="esLongitude"
                    control={control}
                    rules={{ required: true }}
                    inputProps={{ inputmode: "decimal", max: 90, min: -90, step: "0.01" }}
                    type="number"
                    fullWidth
                    error={errors?.esLongitude}
                    defaultValue={panelConfig.data.esLongitude}
                    label="Earth Station Longitude"
                />
            </Grid>

            <Grid item xs={6}>
                <BugConfigFormTextField
                    name="esAltitude"
                    control={control}
                    rules={{ required: true }}
                    inputProps={{ inputmode: "decimal", max: 5000, min: 0, step: "1" }}
                    type="number"
                    fullWidth
                    error={errors?.esAltitude}
                    defaultValue={panelConfig.data.esAltitude}
                    label="Earth Station Altitude"
                />
            </Grid>

            <Grid item xs={6}>
                <BugConfigFormTextField
                    name="satLongitude"
                    control={control}
                    rules={{ required: true }}
                    inputProps={{ inputmode: "decimal", max: 90, min: -90, step: "0.01" }}
                    type="number"
                    fullWidth
                    error={errors?.satLongitude}
                    defaultValue={panelConfig.data.satLongitude}
                    label="Satelite Longitude"
                />
            </Grid>

            <Grid item xs={6}>
                <BugConfigFormSelect
                    name="satDirection"
                    control={control}
                    fullWidth
                    error={errors?.satDirection}
                    defaultValue={panelConfig.data.satDirection}
                    label="Satelite Direction"
                    rules={{ required: true }}
                    options={[
                        { id: "west", label: "West" },
                        { id: "east", label: "East" },
                    ]}
                />
            </Grid>
        </BugConfigWrapper>
    );
}
