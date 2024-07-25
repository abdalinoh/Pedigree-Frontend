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

import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

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

          {/* Logout Route */}
          <Route path="/logout" element={<Logout />} />
          <Route path="/modifier/:id" element={<PrivateRoute><EditMember /></PrivateRoute>} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
