import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchFeedbacks = createAsyncThunk(
  'feedback/fetchFeedbacks',
  async (productId, { getState, extra }) => {
    const { axiosInstance } = extra
    const response = await axiosInstance.get(
      `/feedback/get_all?product_id=${productId}`
    )
    return response.data
  }
)

export const addFeedback = createAsyncThunk(
  'feedback/addFeedback',
  async ({ productId, comment, rating }, { getState, extra }) => {
    const { axiosInstance } = extra
    const response = await axiosInstance.post(`/feedback/post`, {
      comment,
      rating,
      product_id: productId,
    })
    return response.data
  }
)

export const fetchUserFeedback = createAsyncThunk(
  'feedback/get_feedback',
  async (product_id, { getState, extra }) => {
    const { axiosInstance } = extra
    const response = await axiosInstance.get(
      `/feedback/get_feedback?product_id=${product_id}`
    )
    let feedback = response.data
    feedback.exists = feedback.rating
    return feedback
  }
)

export const updateFeedback = createAsyncThunk(
  'feedback/update_feedback',
  async ({ comment, rating, productId }, { getState, extra }) => {
    const { axiosInstance } = extra
    console.log({
      id: 1,
      comment: comment,
      rating: rating,
      product_id: parseInt(productId),
    })
    const response = await axiosInstance.put(`/feedback/update_feedback`, {
      id: 1,
      comment: comment,
      rating: rating,
      product_id: productId,
    })
    return response
  }
)

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: {
    items: [],
    userFeedback: null,
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
      .addCase(fetchUserFeedback.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchUserFeedback.fulfilled, (state, action) => {
        ;(state.status = 'succeeded'), (state.userFeedback = action.payload)
      })
      .addCase(fetchUserFeedback.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(addFeedback.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(addFeedback.fulfilled, (state, action) => {
        state.status = 'succeeded'
      })
      .addCase(addFeedback.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default feedbackSlice.reducer
