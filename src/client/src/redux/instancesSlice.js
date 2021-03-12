import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import delay from 'delay';

export const fetchInstances = createAsyncThunk(
    'users/fetchInstances',
    async (userId, thunkAPI) => {
        const response = await axios.get('/api/instance/config/');
        // await delay(2000);
        console.log(response);
        return response.data
    }
)

const initialState = { 
    contents: [],
    status: 'idle',
    error: null    
};

const instancesSlice = createSlice({
    name: 'instances',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchInstances.pending]: (state, action) => {
            state.status = 'loading'
        },        
        [fetchInstances.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            // Add any fetched posts to the array
            state.contents = action.payload;
        },
        [fetchInstances.rejected]: (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        }        
    }
})

export default instancesSlice.reducer
