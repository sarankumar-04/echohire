import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import { fitmentConfig, categoryConfig, getScoreColor } from '../utils/helpers';

const ScoreRing = ({ value, size = 80, color }) => {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--surface2)" strokeWidth="6" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }} />
    </svg>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats().then(setStats).finally(() => setLoading(false));
  }, []);

  const handleConsoleDump = async () => {
    await adminAPI.consoleDump();
    alert('Console dump printed to backend terminal! Check your server console.');
  };

  if (loading) return (
    <div className="page-body">
      <div className="stats-grid">{[...Array(6)].map((_, i) => <div key={i} className="stat-card"><div className="loading-shimmer" style={{ height: 80 }} /></div>)}</div>
    </div>
  );

  const statItems = [
    { label: 'Total Candidates', value: stats?.totalCandidates, icon: '👥', color: 'blue' },
    { label: 'Assessments Done', value: stats?.totalAssessments, icon: '📋', color: 'cyan' },
    { label: 'Job Ready', value: stats?.jobReady, icon: '✅', color: 'green' },
    { label: 'Need Training', value: stats?.requiresTraining, icon: '📚', color: 'yellow' },
    { label: 'Flagged / Fraud', value: stats?.fraudSuspected, icon: '🚫', color: 'red' },
    { label: 'Question Sets', value: stats?.activeQuestionSets, icon: '❓', color: 'purple' },
  ];

  const fitmentData = [
    { key: 'job-ready', val: stats?.jobReady || 0 },
    { key: 'requires-training', val: stats?.requiresTraining || 0 },
    { key: 'fraud-suspected', val: stats?.fraudSuspected || 0 },
    { key: 'low-confidence', val: stats?.lowConfidence || 0 },
  ];

  const maxVal = Math.max(...fitmentData.map(f => f.val), 1);

  return (
    <>
      <div className="page-header">
        <div className="flex-between">
          <div>
            <h2>Dashboard Overview</h2>
            <p>EchoHire · AI SkillFit Workforce Intelligence</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleConsoleDump}>
            🖥️ Print Console Dump
          </button>
        </div>
      </div>

      <div className="page-body">
        <div className="stats-grid">
          {statItems.map(s => (
            <div key={s.label} className={`stat-card ${s.color}`}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value">{s.value ?? '—'}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ marginBottom: 20 }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Fitment Distribution</span>
            </div>
            {fitmentData.map(f => (
              <div key={f.key} className="chart-bar-row">
                <div className="chart-bar-label" style={{ fontSize: 11 }}>{fitmentConfig[f.key]?.icon} {fitmentConfig[f.key]?.label}</div>
                <div className="chart-bar-wrap">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(f.val / maxVal) * 100}%`, background: fitmentConfig[f.key]?.color }} />
                  </div>
                </div>
                <div className="chart-bar-value">{f.val}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">By Skill Category</span>
            </div>
            {Object.entries(stats?.byCategory || {}).map(([k, v]) => (
              <div key={k} className="chart-bar-row">
                <div className="chart-bar-label" style={{ fontSize: 11 }}>{categoryConfig[k]?.icon} {categoryConfig[k]?.label || k}</div>
                <div className="chart-bar-wrap">
                  <div className="progress-bar">
                    <div className="progress-fill blue" style={{ width: `${(v / (stats?.totalCandidates || 1)) * 100}%` }} />
                  </div>
                </div>
                <div className="chart-bar-value">{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <span className="card-title">AI Assessment Quality</span>
            </div>
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', padding: '10px 0' }}>
              {[
                { label: 'Avg Score', value: Math.round(stats?.avgScore || 0), color: getScoreColor(stats?.avgScore || 0) },
                { label: 'Avg Trust', value: Math.round(stats?.avgTrust || 0), color: '#60a5fa' },
              ].map(item => (
                <div key={item.label} style={{ textAlign: 'center' }}>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <ScoreRing value={item.value} size={80} color={item.color} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: item.color }}>
                      {item.value}%
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 6 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">District-wise Candidates</span>
            </div>
            {Object.entries(stats?.byDistrict || {}).slice(0, 5).map(([k, v]) => (
              <div key={k} className="chart-bar-row">
                <div className="chart-bar-label" style={{ fontSize: 11 }}>📍 {k}</div>
                <div className="chart-bar-wrap">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(v / (stats?.totalCandidates || 1)) * 100}%`, background: 'var(--accent3)' }} />
                  </div>
                </div>
                <div className="chart-bar-value">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
