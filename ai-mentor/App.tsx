

import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import MockInterview from './pages/MockInterview';
import PlacementPrep from './pages/PlacementPrep';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import JobVacancy from './pages/JobVacancy';
import CareerRoadmap from './pages/CareerRoadmap';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/mock-interview" element={<MockInterview />} />
          <Route path="/placement-prep" element={<PlacementPrep />} />
          <Route path="/job-vacancy" element={<JobVacancy />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/career-roadmap" element={<CareerRoadmap />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;