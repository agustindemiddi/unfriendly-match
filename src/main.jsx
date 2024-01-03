import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AuthContextProvider } from './context/authContext';

import RootLayout from './components/UI/RootLayout/RootLayout';
import ErrorPage from './pages/ErrorPage';

import SignInPage from './pages/SignInPage';
import HomePage from './pages/HomePage';

import ContactsPage from './pages/contacts/ContactsPage';
import ContactDetailPage from './pages/contacts/ContactDetailPage';

import TournamentsPage from './pages/tournaments/TournamentsPage';
import TournamentDetailPage from './pages/tournaments/TournamentDetailPage';
import NewTournamentPage from './pages/tournaments/NewTournamentPage';
import EditTournamentPage from './pages/tournaments/EditTournamentPage';
import TournamentPlayersPage from './pages/tournaments/TournamentPlayersPage';
import NewTournamentPlayerPage from './pages/tournaments/NewTournamentPlayerPage';

import MatchesPage from './pages/matches/MatchesPage';
import NewMatchPage from './pages/matches/NewMatchPage';
import MatchDetailPage from './pages/matches/MatchDetailPage';
import EditMatchPage from './pages/matches/EditMatchPage';

// import Test from './components/_testing/Test';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthContextProvider>
        <RootLayout />
      </AuthContextProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      { path: 'signin', element: <SignInPage /> },
      // { path: 'test', element: <Test /> },
      {
        path: ':playerId',
        element: <ContactDetailPage />,
      },
      {
        path: 'contacts',
        children: [{ index: true, element: <ContactsPage /> }],
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
                path: 'players',
                children: [
                  { index: true, element: <TournamentPlayersPage /> },
                  { path: 'new', element: <NewTournamentPlayerPage /> },
                ],
              },

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
    <RouterProvider router={router} />
  </React.StrictMode>
);
