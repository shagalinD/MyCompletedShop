import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from '../features/authSlice'
import productsReducer from '../features/productsSlice'
import orderReducer from '../features/orderSlice'
import cartReducer from '../features/cartSlice'
import axios from 'axios'
import feedbackReducer from '../features/feedbackSlice'
import { logout } from '../features/authSlice'

// Настройка axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
})

// Добавляем токен в заголовки
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Обработка 401 ошибки (истечение токена)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.config.skipInterceptors) {
      return Promise.reject(error)
    }
    if (error.response?.status === 401) {
      store.dispatch(logout())
      window.location.href = '/auth' // Перенаправление на страницу входа
    }
    return Promise.reject(error)
  }
)

// Подключаем axiosInstance в store
const persistConfig = {
  key: 'root',
  storage,
}
const persistedCartReducer = persistReducer(persistConfig, cartReducer)
const persistedAuthReducer = persistReducer(persistConfig, authReducer)
const persistedOrderReducer = persistReducer(persistConfig, orderReducer)
export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: persistedCartReducer,
    auth: persistedAuthReducer,
    order: persistedOrderReducer,
    feedback: feedbackReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
      thunk: {
        extraArgument: { axiosInstance: axiosInstance },
      },
    }),
})

export const persistor = persistStore(store)
