import { configureStore } from '@reduxjs/toolkit'
import stateLegendReducer from './stateLegendSlice'

export const store = configureStore({
  reducer: {
    stateLegend: stateLegendReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
