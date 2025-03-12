import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { Provider } from 'react-redux';
import store from './store.js';
import App from './App.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomeScreen from './screens/HomeScreen.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import CreateTicketScreen from './screens/CreateTicketScreen.jsx';
import MyTicketsScreen from './screens/MyTicketsScreen.jsx';
import TicketDetailsScreen from './screens/TicketDetailsScreen.jsx';
import CreateUserScreen from './screens/CreateUserScreen.jsx';
import AdminUsersScreen from './screens/AdminUsersScreen.jsx';
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index={true} path="/" element={<HomeScreen />} />
            <Route index={true} path="/login" element={<LoginScreen />} />
            <Route index={true} path="/register" element={<RegisterScreen />} />
            <Route path="" element={<PrivateRoute />}>
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/ticket" element={<CreateTicketScreen />} />
              <Route path="/tickets" element={<MyTicketsScreen />} />
              <Route path="/ticket/:id" element={<TicketDetailsScreen />} />
              <Route path="/create" element={<CreateUserScreen />} />
              <Route path="/admin/users" element={<AdminUsersScreen />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </StrictMode>
  </Provider>,
);
