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
                    inputProps={{...register('title')}}
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
                <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="outlined-age-native-simple">Clock Type</InputLabel>
                    <Select
                        native
                        defaultValue={ config?.type }
                        label="Clock Type"
                        error={errors?.type ? true : false}
                        inputProps={{...register('type')}}
                    >
                        <option value={'digital'}>Digital</option>
                        <option value={'analogue'}>Analogue</option>
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