import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { Provider } from 'react-redux';
import store from './store.js';
import App from './App.jsx';
import HomeScreen from '../screens/HomeScreen.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginScreen from '../screens/LoginScreen.jsx';
import RegisterScreen from '../screens/RegisterScreen.jsx';
import PrivateRoute from '../components/PrivateRoute.jsx';
import ProfileScreen from '../screens/ProfileScreen.jsx';
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
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </StrictMode>
  </Provider>,
);
