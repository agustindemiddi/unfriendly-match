import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import RootLayout from './pages/RootLayout';
import HomePage from './pages/Homepage';
import TournamentsPage from './pages/TournamentsPage';
import GroupsPage from './pages/GroupsPage';
import ContactsPage from './pages/ContactsPage';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '/tournaments', element: <TournamentsPage /> },
      { path: '/groups', element: <GroupsPage /> },
      { path: '/contacts', element: <ContactsPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
