import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { districtList, languageConfig, categoryConfig } from '../utils/helpers';

export default function AuthPage() {
  const { login } = useAuth();
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ username: '', password: '', name: '', email: '', phone: '', district: 'Bengaluru', language: 'kn', skillCategory: 'blue-collar' });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const res = await authAPI.login({ username: form.username, password: form.password });
      login(res.user);
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const res = await authAPI.register(form);
      login(res.user);
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-pattern" />
      <div className="auth-card">
        <div className="auth-logo">
          <h1>EchoHire</h1>
          <p>AI-Powered Workforce Assessment Platform</p>
          <p style={{ fontSize: 11, marginTop: 4, color: 'var(--text3)' }}>Government of Karnataka · EDCS</p>
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Sign In</button>
          <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>Register</button>
        </div>

        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#f87171' }}>{error}</div>}

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input className="form-input" placeholder="admin or ramesh" value={form.username} onChange={e => set('username', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} required />
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
            <div style={{ marginTop: 16, padding: '12px', background: 'var(--surface2)', borderRadius: 8, fontSize: 12 }}>
              <div style={{ color: 'var(--text3)', marginBottom: 6, fontWeight: 600 }}>Demo Credentials:</div>
              <div style={{ color: 'var(--text2)' }}>Admin: <strong>admin</strong> / <strong>admin123</strong></div>
              <div style={{ color: 'var(--text2)' }}>Candidate: <strong>ramesh</strong> / <strong>pass123</strong></div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input className="form-input" placeholder="username" value={form.username} onChange={e => set('username', e.target.value)} required />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="email@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="9876543210" value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">District</label>
                <select className="form-select" value={form.district} onChange={e => set('district', e.target.value)}>
                  {districtList.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Language</label>
                <select className="form-select" value={form.language} onChange={e => set('language', e.target.value)}>
                  {Object.entries(languageConfig).map(([k, v]) => <option key={k} value={k}>{v.flag} {v.label}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Skill Category</label>
              <select className="form-select" value={form.skillCategory} onChange={e => set('skillCategory', e.target.value)}>
                {Object.entries(categoryConfig).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Create password" value={form.password} onChange={e => set('password', e.target.value)} required />
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Registering...' : 'Create Account →'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
