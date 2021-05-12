import React, { useContext } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { useForm } from "react-hook-form";
import PanelConfig from "@core/PanelConfig";
import Loading from "@components/Loading";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import PanelConfigContext from '@core/PanelConfigContext';
import axios from 'axios';

export default function EditPanel() {

    const config = useContext(PanelConfigContext);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();

    if (!config) {
        return <Loading />;
    }

    return (
        <>
            <PanelConfig config={config} handleSubmit={handleSubmit}>
                <Grid item xs={12} >
                    <TextField
                        inputProps={{ ...register('title', { required: true }) }}
                        variant="filled"
                        fullWidth
                        error={errors?.title ? true : false}
                        defaultValue={config?.title}
                        type='text'
                        label="Panel Title"
                    />
                </Grid>

                <Grid item xs={12} >
                    <TextField
                        inputProps={{ ...register('description') }}
                        variant="filled"
                        fullWidth
                        error={errors?.description ? true : false}
                        defaultValue={config?.description}
                        type='text'
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

                <Grid item xs={6} >
                    <TextField
                        inputProps={{ ...register('username', { required: true }) }}
                        variant="filled"
                        fullWidth
                        error={errors?.username ? true : false}
                        defaultValue={config?.username}
                        type='text'
                        label="Web Interface Username"
                    />
                </Grid>

                <Grid item xs={6} >
                    <TextField
                        inputProps={{ ...register('password', { required: true }) }}
                        variant="filled"
                        fullWidth
                        error={errors?.password ? true : false}
                        defaultValue={config?.password}
                        type='password'
                        label="Web Interface Password"
                    />
                </Grid>


                <Grid item xs={6} >
                    <TextField
                        inputProps={{ ...register('outputs', { required: true }), step: 'any' }}
                        variant="filled"
                        fullWidth
                        error={errors?.outputs ? true : false}
                        defaultValue={config?.outputs}
                        type='number'
                        label='Outputs'
                    />
                </Grid>


                <Grid item xs={6} >
                    <FormControl variant="filled" fullWidth>
                        <InputLabel>Model</InputLabel>
                        <Select
                            native
                            defaultValue={config?.model}
                            label="Model"
                            error={errors?.model ? true : false}
                            inputProps={{ ...register('model', { required: true }) }}
                        >
                            <option value={'tsl-mdu-3es'}>TSL MDU 3ES</option>
                            <option value={'tsl-mdu-3es'}>TSL MDU 3ES</option>
                            <option value={'tsl-mdu-3es'}>TSL MDU 3ES</option>
                        </Select>
                    </FormControl>
                </Grid>

            </PanelConfig>

        </>
    );

}