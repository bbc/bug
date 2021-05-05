import React, { useContext } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { useForm } from "react-hook-form";
import PanelConfig from "@core/PanelConfig";
import Loading from "@components/Loading";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import PanelContext from '@core/PanelContext';

export default function EditPanel() {

    const config = useContext(PanelContext);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

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

                <Grid item xs={12} >
                    <FormControl variant="filled" fullWidth>
                        <InputLabel>Type</InputLabel>
                        <Select
                            native
                            defaultValue={config?.type}
                            label="Type"
                            error={errors?.type ? true : false}
                            inputProps={{ ...register('type', { required: true }) }}
                        >
                            <option value={'analogue'}>Analogue</option>
                            <option value={'digital'}>Digital</option>
                        </Select>
                    </FormControl>
                </Grid>

            </PanelConfig>
        </>
    );
}
