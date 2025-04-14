import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue, extra }) => {
    try {
      const { axiosInstance } = extra // Получаем axiosInstance из extraArgument
      const { data } = await axiosInstance.get('/cart/get_cart', {
        skipInterceptors: true,
      }) // Используем относительный путь
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const addCartItem = createAsyncThunk(
  'cart/addItem',
  async ({ product_id, quantity }, { getState, rejectWithValue, extra }) => {
    try {
      console.log(product_id)
      const { axiosInstance } = extra // Получаем axiosInstance из extraArgument
      const { data } = await axiosInstance.post('/cart/add_product', {
        product_id,
        quantity,
      })
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async ({ product_id }, { getState, rejectWithValue, extra }) => {
    try {
      const { axiosInstance } = extra
      const response = await axiosInstance.put('/cart/remove_product', {
        product_id,
      })
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const clearCart = createAsyncThunk(
  'cart/cleanCart',
  async (_, { getState, rejectWithValue, extra }) => {
    try {
      const { axiosInstance } = extra
      const response = await axiosInstance.delete('/cart/clean_cart')
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const initialState = {
  items: [],
  total: 0,
  status: 'idle',
  error: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = Array.isArray(action.payload?.items)
          ? action.payload.items
          : []
        state.total = calculateTotal(state.items)
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Failed to fetch cart'
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload?.items)
          ? action.payload.items
          : state.items
        state.total = calculateTotal(state.items)
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.error = action.payload || 'Failed to remove item'
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.error = action.payload || 'Failed to remove item'
      })
  },
})

function calculateTotal(items = []) {
  return items.reduce((sum, item) => {
    const price = item?.product?.price || 0
    const quantity = item?.quantity || 0
    return sum + price * quantity
  }, 0)
}

export const { removeItem } = cartSlice.actions
export default cartSlice.reducer
