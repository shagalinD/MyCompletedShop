import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchFeedbacks = createAsyncThunk(
  'feedback/fetchFeedbacks',
  async (productId, { getState, extra }) => {
    const { axios } = extra
    const response = await axios.get(
      `/feedback/get_all?product_id=${productId}`
    )
    return response.data
  }
)

export const addFeedback = createAsyncThunk(
  'feedback/addFeedback',
  async ({ productId, comment, rating }, { getState, extra }) => {
    const { axios } = extra
    const response = await axios.post(`/feedback/post`, {
      comment,
      rating,
      productId,
    })
    return response.data
  }
)

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedbacks.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(addFeedback.pending, (state, action) => {
        // Можно добавить временный отзыв с флагом isPending
        state.status = 'loading'
      })
      .addCase(addFeedback.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Заменяем или добавляем полный объект от сервера
        const index = state.items.findIndex(
          (item) => item.tempId === action.meta.arg.tempId
        )
        if (index >= 0) {
          state.items[index] = action.payload
        } else {
          state.items.push(action.payload)
        }
      })
      .addCase(addFeedback.rejected, (state, action) => {
        state.status = 'failed'
        // Удаляем временный отзыв, если был добавлен
        state.items = state.items.filter(
          (item) => item.tempId !== action.meta.arg.tempId
        )
      })
  },
})

export default feedbackSlice.reducer
