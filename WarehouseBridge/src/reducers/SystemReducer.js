import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    loading: false
}

const systemSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        changeLoadingState: (state, action) => {
            state.loading = action.payload
        }
    }
})

export const { changeLoadingState } = systemSlice.actions

export default systemSlice.reducer