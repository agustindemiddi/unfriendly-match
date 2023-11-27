import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AuthContextProvider } from './context/AuthContext';

import RootLayout from './components/UI/RootLayout';
import ErrorPage from './pages/ErrorPage';

import SignInPage from './pages/SignInPage';
import HomePage from './pages/HomePage';

import ContactsPage from './pages/contacts/ContactsPage';
import ContactDetailPage from './pages/contacts/ContactDetailPage';

import TournamentsPage from './pages/tournaments/TournamentsPage';
import TournamentDetailPage from './pages/tournaments/TournamentDetailPage';
import NewTournamentPage from './pages/tournaments/NewTournamentPage';
import EditTournamentPage from './pages/tournaments/EditTournamentPage';

import MatchesPage from './pages/matches/MatchesPage';
import NewMatchPage from './pages/matches/NewMatchPage';
import MatchDetailPage from './pages/matches/MatchDetailPage';
import EditMatchPage from './pages/matches/EditMatchPage';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      { path: 'signin', element: <SignInPage /> },
      {
        path: 'contacts',
        children: [
          { index: true, element: <ContactsPage /> },
          {
            path: ':contactId',
            children: [{ index: true, element: <ContactDetailPage /> }],
          },
        ],
      },
      {
        path: 'tournaments',
        children: [
          { index: true, element: <TournamentsPage /> },
          { path: 'new', element: <NewTournamentPage /> },
          {
            path: ':tournamentId',
            children: [
              { index: true, element: <TournamentDetailPage /> },
              { path: 'edit', element: <EditTournamentPage /> },
              {
                path: 'matches',
                children: [
                  { index: true, element: <MatchesPage /> },
                  { path: 'new', element: <NewMatchPage /> },
                  {
                    path: ':matchId',
                    children: [
                      { index: true, element: <MatchDetailPage /> },
                      { path: 'edit', element: <EditMatchPage /> },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </React.StrictMode>
);
