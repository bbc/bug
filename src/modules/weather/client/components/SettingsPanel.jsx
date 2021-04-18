import React from "react";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

export default function ConfigPanel({ register, errors, config }) {

    return(

        <React.Fragment>
            <Grid item xs={12} >
                <TextField
                    inputProps={{...register('title', { required: true } )}}
                    variant="outlined"
                    fullWidth
                    error={errors?.title ? true : false}
                    defaultValue={ config?.title }
                    type='text'
                    label="Panel Title"
                />
            </Grid>

            <Grid item xs={12} >
                <TextField
                    inputProps={{...register('description')}}
                    variant="outlined"
                    fullWidth
                    error={errors?.description ? true : false}
                    defaultValue={ config?.description }
                    type='text'
                    label="Description"
                />
            </Grid>

            <Grid item xs={12} >
                <TextField
                    inputProps={{...register('openweather_key', { required: true } )}}
                    variant="outlined"
                    fullWidth
                    error={errors?.openweather_key ? true : false}
                    defaultValue={ config?.openweather_key }
                    type='text'
                    label="OpenWeather API Key"
                />
            </Grid>

            <Grid item xs={12} >
                <TextField
                    inputProps={ {...register('label', { required: true } )}}
                    variant="outlined"
                    fullWidth
                    error={errors?.label ? true : false}
                    defaultValue={ config?.label }
                    type='text'
                    label='Location Name'
                />
            </Grid>

            <Grid item xs={6} >
                <TextField
                    inputProps={{...register('longitude', { required: true } ), step: 'any' }}
                    variant="outlined"
                    fullWidth
                    error={errors?.longitude ? true : false}
                    defaultValue={ config?.longitude }
                    type='number'
                    label='Location Longitude'
                    step='any'
                />
            </Grid>

            <Grid item xs={6} >
                <TextField
                    inputProps={ {...register('latitude', { required: true } ), step: 'any' }}
                    variant="outlined"
                    fullWidth
                    error={errors?.latitude ? true : false}
                    defaultValue={ config?.latitude }
                    type='number'
                    label='Location Latitude'
                />
            </Grid>

            <Grid item xs={6} >
                <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="outlined-age-native-simple">Forecast Length</InputLabel>
                    <Select
                        native
                        defaultValue={ config?.length }
                        label="Forecast Length"
                        error={errors?.length ? true : false}
                        inputProps={{...register('length', { required: true } )}}
                    >
                        <option value={'today'}>Today Only</option>
                        <option value={'week'}>5 Day Forecast</option>
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={6} >
                <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="outlined-age-native-simple">Units</InputLabel>
                    <Select
                        native
                        defaultValue={ config?.units }
                        label="Units"
                        error={errors?.units ? true : false}
                        inputProps={{...register('units', { required: true } )}}
                    >
                        <option value={'metric'}>Metric</option>
                        <option value={'standard'}>Standard</option>
                        <option value={'imperial'}>Imperial</option>
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12} >
                <Button type='submit' variant="contained" color="default" size='large' disableElevation>
                    Save
                </Button>
            </Grid>

    </React.Fragment>
    ); 

}