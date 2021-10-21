import React from "react";
import Grid from "@mui/material/Grid";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugConfigWrapper from "@core/BugConfigWrapper";
import Loading from "@components/Loading";
import { useSelector } from "react-redux";
import BugConfigFormPanelGroup from "@core/BugConfigFormPanelGroup";
import { useConfigFormHandler } from "@hooks/ConfigFormHandler";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
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
            <BugConfigWrapper config={panelConfig.data} handleSubmit={handleSubmit}>
                <Grid item xs={12}>
                    <BugConfigFormTextField
                        inputProps={{
                            ...register("title", { required: true }),
                        }}
                        required
                        fullWidth
                        error={errors.title}
                        defaultValue={panelConfig.data.title}
                        type="text"
                        label="Panel Title"
                    />
                </Grid>

                <Grid item xs={12}>
                    <BugConfigFormTextField
                        inputProps={{ ...register("description") }}
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
                    <FormControl fullWidth>
                        <InputLabel>Type</InputLabel>
                        <Select
                            native
                            variant="standard"
                            defaultValue={panelConfig.data.type}
                            label="Type"
                            error={errors?.type ? true : false}
                            inputProps={{
                                ...register("type", { required: true }),
                            }}
                        >
                            <option value={"analogue"}>Analogue</option>
                            <option value={"digital"}>Digital</option>
                        </Select>
                    </FormControl>
                </Grid>
            </BugConfigWrapper>
        </>
    );
}
