import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Purchase from './pages/purchase'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import SelectGift from './pages/purchase/select-gift.tsx'
import ConfirmOrder from './pages/purchase/confirm-order.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Navigate to="/purchase" />,
      },
      {
        path: 'purchase',
        element: <Purchase />,
        children: [
          {
            path: 'select-gift',
            element: <SelectGift />,
          },
          {
            path: 'confirm-order',
            element: <ConfirmOrder />,
          }
        ]
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
