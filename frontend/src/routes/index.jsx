import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Pages
import Home from '../pages/Home';
import Cars from '../pages/Cars';
import CarDetails from '../pages/CarDetails';
import Booking from '../pages/Booking';
import Dashboard from '../pages/Dashboard';
import Auth from '../pages/Auth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'cars',
        element: <Cars />,
      },
      {
        path: 'cars/:id',
        element: <CarDetails />,
      },
      {
        path: 'booking',
        element: <Booking />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Auth />,
      },
    ],
  },
]);
