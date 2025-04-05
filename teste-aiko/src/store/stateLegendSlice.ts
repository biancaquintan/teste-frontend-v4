import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export type StateDefinition = {
  id: string
  name: string
  color: string
}

type StateLegend = Record<string, StateDefinition>

type State = {
  data: StateLegend
  loading: boolean
  error: string | null
}

const initialState: State = {
  data: {},
  loading: false,
  error: null
}

export const fetchStateLegend = createAsyncThunk(
  'stateLegend/fetch',
  async () => {
    const res = await fetch('/data/equipmentState.json')
    const json: StateDefinition[] = await res.json()

    const legend = json.reduce((acc, item) => {
      acc[item.id] = item
      return acc
    }, {} as Record<string, StateDefinition>)
    return legend
  }
)

const stateLegendSlice = createSlice({
  name: 'stateLegend',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchStateLegend.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchStateLegend.fulfilled,
        (state, action: PayloadAction<StateLegend>) => {
          state.data = action.payload
          state.loading = false
        }
      )
      .addCase(fetchStateLegend.rejected, (state, action) => {
        state.loading = false
        state.error = 'Erro ao carregar legenda de estados'
      })
  }
})

export default stateLegendSlice.reducer
