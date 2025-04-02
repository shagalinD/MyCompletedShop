import React from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom' // Используем Outlet для отображения дочерних маршрутов
import { persistor, store } from '../store/store'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { ThemeContextProvider } from '../context/ThemeContext'
import { CssBaseline } from '@mui/material'
import { setCredentials } from '../features/authSlice'

const Layout = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeContextProvider>
          <CssBaseline />
          <Outlet />
        </ThemeContextProvider>
      </PersistGate>
    </Provider>
  )
}

export default Layout
