import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const createOrder = createAsyncThunk(
  'cart/createOrder',
  async (address, { getState, rejectWithValue, extra }) => {
    try {
      const { axiosInstance } = extra // Получаем axiosInstance из extraArgument
      const { data } = await axiosInstance.post('/order/create', {
        address: address,
      }) // Используем относительный путь
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const getAll = createAsyncThunk(
  'cart/getAll',
  async (_, { getState, rejectWithValue, extra }) => {
    try {
      const { axiosInstance } = extra // Получаем axiosInstance из extraArgument
      const { data } = await axiosInstance.get('/order/get_all') // Используем относительный путь
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const initialState = {
  status: 'idle',
  orderNumber: 'ORD-2025-0000',
  orderStatus: null,
  orderDate: null,
  error: null,
}

const orderSlice = createSlice({
  name: 'order',
  orders: null,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAll.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getAll.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.orders = action.payload.orders
      })
      .addCase(getAll.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Failed to create order'
      })
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.orderNumber = action.payload?.order_number
        state.orderStatus = action.payload?.order_status
        state.orderDate = action.payload?.date
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Failed to create order'
      })
  },
})

export default orderSlice.reducer
