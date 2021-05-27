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
                    <FormControl variant="filled" fullWidth>
                        <InputLabel>Type</InputLabel>
                        <Select
                            native
                            defaultValue={panelConfig.data.type}
                            label="Type"
                            error={errors?.type ? true : false}
                            inputProps={{ ...register("type", { required: true }) }}
                        >
                            <option value={"analogue"}>Analogue</option>
                            <option value={"digital"}>Digital</option>
                        </Select>
                    </FormControl>
                </Grid>
            </PanelConfig>
        </>
    );
}
