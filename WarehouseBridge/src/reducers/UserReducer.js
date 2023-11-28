import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    auth: JSON.parse(localStorage.getItem('user')) || null,
    role: localStorage.getItem('role') || null
}

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        authen: (state, action) => {
            state.auth = action.payload
        },
        setRole: (state, action) => {
            state.role = action.payload
        }
    }
})

export const { authen, setRole } = usersSlice.actions

export default usersSlice.reducer