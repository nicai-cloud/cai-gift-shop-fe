import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Purchase from './pages/purchase'
import Success from './pages/success'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import SelectOption from './pages/purchase/select-option.tsx'
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
            path: 'select-option',
            element: <SelectOption />,
          },
          {
            path: 'select-gift',
            element: <SelectGift />,
          },
          {
            path: 'confirm-order',
            element: <ConfirmOrder />,
          }
        ]
      },
      // {
      //   path: 'collections',
      //   element: <Collections />,
      //   children: [
      //     {
      //       path: 'boys-gift',
      //       element: <BoysGift />,
      //     },
      //     {
      //       path: 'girls-gift',
      //       element: <GirlsGift />,
      //     }
      //   ]
      // },
      {
        path: '/success',
        element: <Success />,
      },
      {
        path: '*',
        element: <Navigate to='/select-option' replace />,
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
