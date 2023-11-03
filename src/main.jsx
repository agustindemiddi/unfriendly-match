import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import RootLayout from './pages/RootLayout';
import ErrorPage from './pages/ErrorPage';

import HomePage from './pages/Homepage';
import TournamentsPage from './pages/TournamentsPage';
import GroupsPage from './pages/GroupsPage';
import ContactsPage from './pages/ContactsPage';

import TournamentDetailsPage from './pages/TournamentDetailsPage';
import GroupDetailsPage from './pages/GroupDetailsPage';
import ContactDetailsPage from './pages/ContactDetailsPage';

import NewTournamentPage from './pages/NewTournamentPage';
import NewGroupPage from './pages/NewGroupPage';
import NewContactPage from './pages/NewContactPage';

import EditTournamentPage from './pages/EditTournamentPage';
import EditGroupPage from './pages/EditGroupPage';
import EditContactPage from './pages/EditContactPage';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'tournaments',
        children: [
          { index: true, element: <TournamentsPage /> },
          {
            path: ':tournamentId',
            children: [
              { index: true, element: <TournamentDetailsPage /> },
              { path: 'edit', element: <EditTournamentPage /> },
            ],
          },
          { path: 'new', element: <NewTournamentPage /> },
        ],
      },
      {
        path: 'groups',
        children: [
          { index: true, element: <GroupsPage /> },
          {
            path: ':groupId',
            children: [
              { index: true, element: <GroupDetailsPage /> },
              { path: 'edit', element: <EditGroupPage /> },
            ],
          },
          { path: 'new', element: <NewGroupPage /> },
        ],
      },
      {
        path: 'contacts',
        children: [
          { index: true, element: <ContactsPage /> },
          {
            path: ':contactId',
            children: [
              { index: true, element: <ContactDetailsPage /> },
              { path: 'edit', element: <EditContactPage /> },
            ],
          },
          { path: 'new', element: <NewContactPage /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
