import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

const HomePage = () => (
  <div>
    <h1>Home</h1>
  </div>
);

const AboutPage = () => (
  <div>
    <h1>About</h1>
  </div>
);

const NotFoundPage = () => (
  <div>
    <h1>404 - Page Not Found</h1>
  </div>
);

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
