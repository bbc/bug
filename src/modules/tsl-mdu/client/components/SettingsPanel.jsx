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
                    inputProps={{...register('ip_address', { required: true } )}}
                    variant="outlined"
                    fullWidth
                    error={errors?.ip_address ? true : false}
                    defaultValue={ config?.ip_address }
                    type='text'
                    label="IP Adrress"
                />
            </Grid>

            <Grid item xs={6} >
                <TextField
                    inputProps={{...register('username', { required: true } )}}
                    variant="outlined"
                    fullWidth
                    error={errors?.username ? true : false}
                    defaultValue={ config?.username }
                    type='text'
                    label="Web Interface Username"
                />
            </Grid>

            <Grid item xs={6} >
                <TextField
                    inputProps={{...register('password', { required: true } )}}
                    variant="outlined"
                    fullWidth
                    error={errors?.password ? true : false}
                    defaultValue={ config?.password }
                    type='password'
                    label="Web Interface Password"
                />
            </Grid>

  
            <Grid item xs={6} >
                <TextField
                    inputProps={{...register('outputs', { required: true } ), step: 'any' }}
                    variant="outlined"
                    fullWidth
                    error={errors?.outputs ? true : false}
                    defaultValue={ config?.outputs }
                    type='number'
                    label='Outputs'
                />
            </Grid>


            <Grid item xs={6} >
                <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="outlined-age-native-simple">Model</InputLabel>
                    <Select
                        native
                        defaultValue={ config?.model }
                        label="Model"
                        error={errors?.model ? true : false}
                        inputProps={{...register('model', { required: true } )}}
                    >
                        <option value={'tsl-mdu-3es'}>TSL MDU 3ES</option>
                        <option value={'tsl-mdu-3es'}>TSL MDU 3ES</option>
                        <option value={'tsl-mdu-3es'}>TSL MDU 3ES</option>
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