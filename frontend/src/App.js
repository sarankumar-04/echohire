import React, { useState } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';

import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import QuestionManager from './pages/QuestionManager';
import CandidatesPage from './pages/CandidatesPage';
import AttemptsPage from './pages/AttemptsPage';
import CandidateDashboard from './pages/CandidateDashboard';
import AssessmentPage from './pages/AssessmentPage';

const NAV_ADMIN = [
  { key: 'dashboard', icon: '📊', label: 'Dashboard' },
  { key: 'questions', icon: '📝', label: 'Question Sets' },
  { key: 'candidates', icon: '👥', label: 'Candidates' },
  { key: 'attempts', icon: '📋', label: 'Results' },
];

const NAV_CANDIDATE = [
  { key: 'dashboard', icon: '🏠', label: 'My Dashboard' },
];

function Sidebar({ active, setActive, nav }) {
  const { user, logout } = useAuth();
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h1>EchoHire</h1>
        <p>AI SkillFit · EDCS Karnataka</p>
      </div>
      <div className="sidebar-nav">
        {nav.map(item => (
          <div key={item.key} className={"nav-item " + (active === item.key ? 'active' : '')} onClick={() => setActive(item.key)}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <div className="user-card" onClick={logout} title="Click to logout">
          <div className="user-avatar">{user && user.name ? user.name[0] : 'U'}</div>
          <div className="user-info">
            <strong>{user ? user.name : ''}</strong>
            <span>{user && user.role === 'admin' ? '🛡️ Admin' : '👤 Candidate'} · Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppInner() {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [activeAssessment, setActiveAssessment] = useState(null);

  if (!user) return <AuthPage />;

  const isAdmin = user.role === 'admin';
  const nav = isAdmin ? NAV_ADMIN : NAV_CANDIDATE;

  const handleStartAssessment = (qs) => {
    setActiveAssessment(Object.assign({}, qs, { _userId: user.id }));
    setActivePage('assessment');
  };

  const handleAssessmentComplete = () => {
    setActiveAssessment(null);
    setActivePage('dashboard');
  };

  const renderPage = () => {
    if (activePage === 'assessment' && activeAssessment) {
      return React.createElement(AssessmentPage, { questionSet: activeAssessment, onComplete: handleAssessmentComplete, onBack: () => { setActivePage('dashboard'); setActiveAssessment(null); } });
    }
    if (isAdmin) {
      if (activePage === 'questions') return React.createElement(QuestionManager, null);
      if (activePage === 'candidates') return React.createElement(CandidatesPage, null);
      if (activePage === 'attempts') return React.createElement(AttemptsPage, null);
      return React.createElement(AdminDashboard, null);
    }
    return React.createElement(CandidateDashboard, { onStartAssessment: handleStartAssessment });
  };

  return (
    <div className="app-container">
      <Sidebar active={activePage} setActive={setActivePage} nav={nav} />
      <main className="main-content">{renderPage()}</main>
    </div>
  );
}

export default function App() {
  return React.createElement(AuthProvider, null, React.createElement(AppInner, null));
}
