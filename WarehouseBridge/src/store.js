import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/UserReducer'
import SystemReducer from './reducers/SystemReducer'
export const store = configureStore({
    reducer: {
        auth: authReducer,
        system: SystemReducer
    }
})