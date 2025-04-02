import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './pages/App'
import Layout from './components/Layout'
import AuthPage from './pages/AuthPage'
import ProductPage from './pages/ProductPage'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/auth',
        element: <AuthPage />,
      },
      {
        path: '/shop',
        element: <App />,
      },
      {
        path: '/product/:id',
        element: <ProductPage />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
