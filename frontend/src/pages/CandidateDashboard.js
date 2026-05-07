import React, { useState, useEffect } from 'react';
import { candidateAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { categoryConfig, formatDate, getScoreColor } from '../utils/helpers';
import FitmentBadge from '../components/FitmentBadge';

export default function CandidateDashboard({ onStartAssessment }) {
  const { user } = useAuth();
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    candidateAPI.getAssigned(user.id).then(setAssigned).finally(() => setLoading(false));
  }, [user.id]);

  const completedCount = assigned.filter(a => a.attemptStatus === 'completed').length;
  const pendingCount = assigned.filter(a => a.attemptStatus === 'not-started').length;

  return (
    <>
      <div className="page-header">
        <div>
          <h2>ನಮಸ್ಕಾರ, {user.name}! 👋</h2>
          <p>Your EchoHire Assessment Portal · Workforce Intelligence Platform</p>
        </div>
      </div>
      <div className="page-body">
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
          <div className="stat-card blue"><div className="stat-icon">📋</div><div className="stat-value">{assigned.length}</div><div className="stat-label">Assigned Tests</div></div>
          <div className="stat-card green"><div className="stat-icon">✅</div><div className="stat-value">{completedCount}</div><div className="stat-label">Completed</div></div>
          <div className="stat-card yellow"><div className="stat-icon">⏳</div><div className="stat-value">{pendingCount}</div><div className="stat-label">Pending</div></div>
        </div>
        <div className="card mb-24">
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800 }}>{user.name?.[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 18, fontFamily: 'Syne, sans-serif' }}>{user.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text2)' }}>
                {categoryConfig[user.skillCategory]?.icon} {categoryConfig[user.skillCategory]?.label} · 📍 {user.district}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>Registered</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{formatDate(user.registered)}</div>
            </div>
          </div>
        </div>
        <h3 style={{ fontFamily: 'Syne, sans-serif', marginBottom: 16, fontSize: 16 }}>Your Assessments</h3>
        {loading ? <div className="loading-shimmer" style={{ height: 100 }} /> : assigned.length === 0 ? (
          <div className="empty-state card">
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No assessments assigned yet</p>
            <p style={{ color: 'var(--text3)' }}>Admin will assign tests to you soon.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {assigned.map(a => (
              <div key={a.id} className="card" style={{ padding: '18px 20px' }}>
                <div className="flex-between">
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, fontFamily: 'Syne, sans-serif', marginBottom: 6 }}>{a.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 10 }}>{a.description}</div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text3)' }}>
                      <span>❓ {a.questions?.length} Questions</span>
                      <span>📊 {a.totalMarks} Marks</span>
                      <span>⏱️ {a.timeLimit} min</span>
                      <span>Pass: {a.passingMarks}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', marginLeft: 16, flexShrink: 0 }}>
                    {a.attemptStatus === 'completed' ? (
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 22, color: getScoreColor(a.percentage), fontFamily: 'Syne, sans-serif' }}>{a.percentage}%</div>
                        <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8 }}>{a.score}/{a.totalMarks}</div>
                        <FitmentBadge cat={a.fitmentCategory || 'pending'} />
                      </div>
                    ) : (
                      <button className="btn btn-primary" onClick={() => onStartAssessment(a)}>Start →</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
