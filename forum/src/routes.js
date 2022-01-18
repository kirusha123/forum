import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ForumPage from './pages/ForumPage';
import AuthPage from './pages/AuthPage';
import RegPage from './pages/RegPage';
import Krol from './pages/Krol';
import PrivateMessanger from './pages/PrivateMessanger';

export const getRoutes = (isAunteficated) => {
  if (isAunteficated)
    return (
      <Routes>
        <Route path="/forum" element={<ForumPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reg" element={<RegPage />} />
        <Route path="/privateMessanger" element={<PrivateMessanger />} />
        <Route path="/krol" element={<Krol />} />
        <Route path="*" element={<Navigate to="/forum" />} />
      </Routes>
    );
  else
    return (
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reg" element={<RegPage />} />
        <Route path="/krol" element={<Krol />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    );
};
