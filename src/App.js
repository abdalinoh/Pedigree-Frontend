// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/register';
import Login from './components/Login';
import Home from './components/Home';
import PrivateRoute from './components/PrivateRoute';
import AddMember from './components/AddMember';
import MemberList from './components/MemberList';
import Logout from './components/Logout';
import Profile from './components/Profile';
import FamilyDiagram from './components/FamilyDiagram';
import EditMember from './components/EditMember';
import MemberDetail from './components/MemberDetail';
import StepperComponent from './components/StepperComponent';
import NotFound from './components/Notfound';
import RedirectIfVisited from './components/RedirectIfVisited';
import { FamilyProvider } from './context/FamilyContext'; // Importer FamilyProvider
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import './App.css';

function App() {
  return (
    <Router>
      <FamilyProvider>
        <RedirectIfVisited /> {/* Inclure le composant RedirectIfVisited */}
        <div>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<StepperComponent />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/rest-password" element={<ResetPassword/>} />
            
            {/* Protected Routes */}
            <Route path="/home" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />
            <Route path="/add-member" element={
              <PrivateRoute>
                <AddMember />
              </PrivateRoute>
            } />
            <Route path="/members-list" element={
              <PrivateRoute>
                <MemberList />
              </PrivateRoute>
            } />
            <Route path="/detail/:id" element={
              <PrivateRoute>
                <MemberDetail />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/family-diagram" element={
              <PrivateRoute>
                <FamilyDiagram />
              </PrivateRoute>
            } />
            <Route path="/modifier/:id" element={
              <PrivateRoute>
                <EditMember />
              </PrivateRoute>
            } />
            {/* Route pour la page 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </FamilyProvider>
    </Router>
  );
}

export default App;