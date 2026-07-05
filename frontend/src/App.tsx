import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useLifePilotStore } from './store/store';
import { Layout } from './components/Layout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { CommandCenter } from './pages/CommandCenter';
import { Productivity } from './pages/Productivity';
import { Finance } from './pages/Finance';
import { Health } from './pages/Health';
import { Learning } from './pages/Learning';
import { Career } from './pages/Career';
import { Relationships } from './pages/Relationships';
import { Journal } from './pages/Journal';
import { Habits } from './pages/Habits';
import { Goals } from './pages/Goals';
import { BrainTraining } from './pages/BrainTraining';
import { DigitalTwin } from './pages/DigitalTwin';
import { SecondBrain } from './pages/SecondBrain';
import { AdminPanel } from './pages/AdminPanel';

// Route Guard for authenticated pages
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useLifePilotStore((state) => state.token);
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <CommandCenter />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/productivity" 
          element={
            <ProtectedRoute>
              <Productivity />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/finance" 
          element={
            <ProtectedRoute>
              <Finance />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/health" 
          element={
            <ProtectedRoute>
              <Health />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/learning" 
          element={
            <ProtectedRoute>
              <Learning />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/career" 
          element={
            <ProtectedRoute>
              <Career />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/relationships" 
          element={
            <ProtectedRoute>
              <Relationships />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/journal" 
          element={
            <ProtectedRoute>
              <Journal />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/habits" 
          element={
            <ProtectedRoute>
              <Habits />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/goals" 
          element={
            <ProtectedRoute>
              <Goals />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/brain-training" 
          element={
            <ProtectedRoute>
              <BrainTraining />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/digital-twin" 
          element={
            <ProtectedRoute>
              <DigitalTwin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/second-brain" 
          element={
            <ProtectedRoute>
              <SecondBrain />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } 
        />

        {/* Fallback redirect to Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};
export default App;
