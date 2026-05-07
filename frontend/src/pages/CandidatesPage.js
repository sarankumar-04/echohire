import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import { fitmentConfig, categoryConfig, languageConfig, districtList, formatDate, getScoreColor } from '../utils/helpers';
import FitmentBadge from '../components/FitmentBadge';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ district: '', category: '', fitment: '', search: '' });

  useEffect(() => {
    adminAPI.getCandidates().then(setCandidates).finally(() => setLoading(false));
  }, []);

  const filtered = candidates.filter(c => {
    if (filters.district && c.district !== filters.district) return false;
    if (filters.category && c.skillCategory !== filters.category) return false;
    if (filters.fitment && c.latestAttempt?.fitmentCategory !== filters.fitment) return false;
    if (filters.search && !c.name?.toLowerCase().includes(filters.search.toLowerCase()) && !c.email?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <div className="page-header">
        <div className="flex-between">
          <div>
            <h2>Candidate Management</h2>
            <p>Filter, review and shortlist candidates across Karnataka</p>
          </div>
          <span style={{ fontSize: 13, color: 'var(--text2)' }}>{filtered.length} of {candidates.length} candidates</span>
        </div>
      </div>
      <div className="page-body">
        <div className="card mb-24">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <input className="form-input" style={{ maxWidth: 220 }} placeholder="Search name / email..." value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
            <select className="form-select" style={{ maxWidth: 160 }} value={filters.district} onChange={e => setFilters(f => ({ ...f, district: e.target.value }))}>
              <option value="">All Districts</option>
              {districtList.map(d => <option key={d}>{d}</option>)}
            </select>
            <select className="form-select" style={{ maxWidth: 160 }} value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}>
              <option value="">All Categories</option>
              {Object.entries(categoryConfig).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
            </select>
            <select className="form-select" style={{ maxWidth: 180 }} value={filters.fitment} onChange={e => setFilters(f => ({ ...f, fitment: e.target.value }))}>
              <option value="">All Fitment</option>
              {Object.entries(fitmentConfig).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
            </select>
            {(filters.district || filters.category || filters.fitment || filters.search) && (
              <button className="btn btn-ghost btn-sm" onClick={() => setFilters({ district: '', category: '', fitment: '', search: '' })}>Clear</button>
            )}
          </div>
        </div>
        <div className="card">
          {loading ? <div className="loading-shimmer" style={{ height: 200 }} /> : filtered.length === 0 ? (
            <div className="empty-state"><div style={{ fontSize: 48 }}>👥</div><p>No candidates found</p></div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Candidate</th><th>District</th><th>Category</th><th>Language</th><th>Score</th><th>Trust</th><th>Fitment</th><th>Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => {
                    const a = c.latestAttempt;
                    return (
                      <tr key={c.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{c.name?.[0]}</div>
                            <div><div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div><div style={{ fontSize: 11, color: 'var(--text3)' }}>{c.email}</div></div>
                          </div>
                        </td>
                        <td><span style={{ fontSize: 13 }}>📍 {c.district}</span></td>
                        <td><span style={{ fontSize: 13 }}>{categoryConfig[c.skillCategory]?.icon} {categoryConfig[c.skillCategory]?.label}</span></td>
                        <td><span style={{ fontSize: 13 }}>{languageConfig[c.language]?.flag} {languageConfig[c.language]?.label}</span></td>
                        <td>{a ? <span style={{ fontWeight: 700, fontSize: 14, color: getScoreColor(a.percentage) }}>{a.percentage?.toFixed(1)}%</span> : <span style={{ color: 'var(--text3)', fontSize: 12 }}>Not taken</span>}</td>
                        <td>{a ? <span style={{ fontWeight: 700, fontSize: 14, color: '#60a5fa' }}>{a.trustScore}</span> : '—'}</td>
                        <td>{a ? <FitmentBadge cat={a.fitmentCategory} /> : <span className="badge badge-gray">Pending</span>}</td>
                        <td style={{ fontSize: 12, color: 'var(--text3)' }}>{formatDate(c.registered)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
