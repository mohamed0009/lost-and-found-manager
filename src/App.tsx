import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Navbar from './components/Layout/Navbar';
import ItemsList from './pages/Items/ItemsList';
import Dashboard from './pages/Dashboard/Dashboard';
import { AuthProvider } from './contexts/AuthContext';
import ReportItem from './pages/Items/ReportItem';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import Footer from './components/Layout/Footer';
import { Box } from '@mui/material';
import About from './pages/About/About';
import Notifications from './pages/Notifications/Notifications';
import { NotificationsProvider } from './contexts/NotificationsContext';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import { ThemeProvider } from './contexts/ThemeContext';
import UserManagement from './pages/Admin/UserManagement';
import PrivateRoute from './components/PrivateRoute';
import RequireAuth from './components/RequireAuth';
import ItemManagement from './pages/Admin/ItemManagement';
import MessageManagement from './pages/Admin/MessageManagement';
import ForgotPassword from './pages/Auth/ForgotPassword';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import fr from 'date-fns/locale/fr';
import TestConnection from './components/TestConnection';
import ItemDetail from './pages/Items/ItemDetail';

function App() {
  return (
    <LocalizationProvider 
      dateAdapter={AdapterDateFns} 
      adapterLocale={fr}
      localeText={{
        cancelButtonLabel: 'Annuler',
        okButtonLabel: 'OK',
        clearButtonLabel: 'Effacer',
        todayButtonLabel: "Aujourd'hui",
      }}
    >
      <ThemeProvider>
        <AuthProvider>
          <NotificationsProvider>
            <Router>
              <Layout>
                <Box sx={{ flex: 1, py: 3 }}>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/about" element={<About />} />
                    
                    <Route path="/" element={
                      <RequireAuth>
                        <Dashboard />
                      </RequireAuth>
                    } />
                    <Route path="/dashboard" element={
                      <RequireAuth>
                        <Dashboard />
                      </RequireAuth>
                    } />
                    <Route path="/items" element={<PrivateRoute><ItemsList /></PrivateRoute>} />
                    <Route path="/items/new" element={<PrivateRoute><ReportItem /></PrivateRoute>} />
                    <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                    <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                    <Route 
                      path="/admin/users" 
                      element={
                        <PrivateRoute roles={['Admin']}>
                          <UserManagement />
                        </PrivateRoute>
                      } 
                    />
                    <Route path="/admin/items" element={
                      <PrivateRoute roles={['Admin']}>
                        <ItemManagement />
                      </PrivateRoute>
                    } />
                    <Route path="/admin/messages" element={
                      <PrivateRoute roles={['Admin']}>
                        <MessageManagement />
                      </PrivateRoute>
                    } />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/items/:id" element={<ItemDetail />} />
                  </Routes>
                </Box>
              </Layout>
              <TestConnection />
            </Router>
          </NotificationsProvider>
        </AuthProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;