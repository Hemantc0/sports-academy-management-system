import { createRoot } from 'react-dom/client';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

import {
  ToastContainer,
  Zoom
} from 'react-toastify';

import Home from './common/Home.jsx';
import Login from './common/Login.jsx';
import Register from './common/Register.jsx';
import BackgroundImage from './common/BackgroundImage.jsx';

import AdminDashBoard from './admin/AdminDashBoard.jsx';
import ManageSports from './admin/ManageSports.jsx';
import ManageBranches from './admin/ManageBranches.jsx';
import ManageCoaches from './admin/ManageCoaches.jsx';
import ManagePlayers from './admin/ManagePlayers.jsx';
import ManageMemberships from './admin/ManageMembership.jsx';
import ManageBatches from './admin/ManageBatches.jsx';
import ManagePayments from './admin/ManagePayments.jsx';
import ManageTrainingPrograms from './admin/ManageTrainingPrograms.jsx';

import CoachDashBoard from './coach/CoachDashBoard.jsx';
import MyBatches from './coach/MyBatches.jsx';
import MyPlayers from './coach/MyPlayers.jsx';
import TrainingPrograms from './coach/TrainingPrograms.jsx';
import CoachProfile from './coach/CoachProfile.jsx';

import PlayerDashboard from './player/PlayerDashBoard.jsx';
import MyMembership from './player/MyMembership.jsx';
import Payments from './player/Payments.jsx';
import PlayerProfile from './player/PlayerProfile.jsx';
import PlayerMyBatches from './player/PlayerMyBatches.jsx';

const myRoutes = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },

  // Admin Routes
  {
    path: '/admin',
    element: <AdminDashBoard />
  },
  {
    path: '/admin/manage-sports',
    element: <ManageSports />
  },
  {
    path: '/admin/manage-branches',
    element: <ManageBranches />
  },
  {
    path: '/admin/manage-coaches',
    element: <ManageCoaches />
  },
  {
    path: '/admin/manage-players',
    element: <ManagePlayers />
  },
  {
    path: '/admin/manage-trainingprograms',
    element: <ManageTrainingPrograms />
  },
  {
    path: '/admin/manage-batches',
    element: <ManageBatches />
  },
  {
    path: '/admin/manage-memberships',
    element: <ManageMemberships />
  },
  {
    path: '/admin/manage-payments',
    element: <ManagePayments />
  },

  // Coach Independent Routes
  {
    path: '/coach',
    element: <CoachDashBoard />
  },
  {
    path: '/coach/my-batches',
    element: <MyBatches />
  },
  {
    path: '/coach/my-players',
    element: <MyPlayers />
  },
  {
    path: '/coach/training-programs',
    element: <TrainingPrograms />
  },
  {
    path: '/coach/profile',
    element: <CoachProfile />
  },

  // Player Routes
  {
    path: '/player',
    element: <PlayerDashboard />
  },
  {
    path: '/player/membership',
    element: <MyMembership />
  },
  {
    path: '/player/my-batches',
    element: <PlayerMyBatches />
  },
  {
    path: '/player/payments',
    element: <Payments />
  },
  {
    path: '/player/profile',
    element: <PlayerProfile />
  }
]);

createRoot(document.getElementById('root')).render(
  <>
    <BackgroundImage />

    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Zoom}
    />

    <RouterProvider router={myRoutes} />
  </>
);