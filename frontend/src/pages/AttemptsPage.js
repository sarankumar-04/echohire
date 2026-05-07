import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import { fitmentConfig, formatDate, getScoreColor } from '../utils/helpers';
import FitmentBadge from '../components/FitmentBadge';

export default function AttemptsPage() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewDetail, setViewDetail] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    adminAPI.getAttempts().then(setAttempts).finally(() => setLoading(false));
  }, []);

  const handleFlag = async (id) => {
    const updated = await adminAPI.flagAttempt(id);
    setAttempts(a => a.map(x => x.id === id ? { ...x, flagged: updated.flagged, fitmentCategory: updated.fitmentCategory } : x));
    if (viewDetail?.id === id) setViewDetail(d => ({ ...d, flagged: updated.flagged, fitmentCategory: updated.fitmentCategory }));
  };

  const handleViewDetail = async (id) => {
    const detail = await adminAPI.getAttemptDetail(id);
    setViewDetail(detail);
  };

  const filtered = attempts.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'completed') return a.status === 'completed';
    if (filter === 'flagged') return a.flagged;
    if (filter === 'in-progress') return a.status === 'in-progress';
    return a.fitmentCategory === filter;
  });

  return (
    <>
      <div className="page-header">
        <div className="flex-between">
          <div><h2>Assessment Results</h2><p>Review candidate attempt results and AI analysis</p></div>
          <span style={{ fontSize: 13, color: 'var(--text2)' }}>{filtered.length} results</span>
        </div>
      </div>
      <div className="page-body">
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {[['all','All'],['completed','Completed'],['in-progress','In Progress'],['flagged','Flagged'],['job-ready','Job Ready'],['requires-training','Needs Training']].map(([k, l]) => (
            <button key={k} className={'btn btn-sm ' + (filter === k ? 'btn-primary' : 'btn-ghost')} onClick={() => setFilter(k)}>{l}</button>
          ))}
        </div>
        <div className="card">
          {loading ? <div className="loading-shimmer" style={{ height: 200 }} /> : filtered.length === 0 ? (
            <div className="empty-state"><div style={{ fontSize: 48 }}>📊</div><p>No attempts found</p></div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Candidate</th><th>Assessment</th><th>Score</th><th>Trust</th><th>Face/Voice</th><th>Fitment</th><th>Date</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.map(a => (
                    <tr key={a.id} style={{ opacity: a.flagged ? 0.7 : 1 }}>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{a.userName || 'Unknown'}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)' }}>📍 {a.userDistrict}</div>
                      </td>
                      <td style={{ fontSize: 12, maxWidth: 180 }}>
                        <div style={{ fontWeight: 500 }}>{a.questionSetTitle}</div>
                        <div style={{ color: 'var(--text3)', fontSize: 11 }}>{a.status === 'in-progress' ? '⏳ In Progress' : '✅ Done'}</div>
                      </td>
                      <td>{a.status === 'completed' ? <span style={{ fontWeight: 700, fontSize: 15, color: getScoreColor(a.percentage) }}>{a.percentage?.toFixed(1)}%</span> : '—'}</td>
                      <td>{a.trustScore > 0 ? <span style={{ fontWeight: 700, color: '#60a5fa' }}>{a.trustScore}</span> : '—'}</td>
                      <td style={{ fontSize: 13 }}>
                        <span style={{ color: a.faceVerified ? 'var(--success)' : 'var(--danger)' }}>{a.faceVerified ? '✅' : '❌'} F</span>{' '}
                        <span style={{ color: a.voiceVerified ? 'var(--success)' : 'var(--danger)' }}>{a.voiceVerified ? '✅' : '❌'} V</span>
                      </td>
                      <td>{a.flagged ? <span className="badge badge-red">🚫 Flagged</span> : <FitmentBadge cat={a.fitmentCategory} />}</td>
                      <td style={{ fontSize: 11, color: 'var(--text3)' }}>{formatDate(a.endTime || a.startTime)}</td>
                      <td>
                        <div className="gap-8">
                          <button className="btn btn-ghost btn-sm" onClick={() => handleViewDetail(a.id)}>👁</button>
                          {a.status === 'completed' && (
                            <button className={'btn btn-sm ' + (a.flagged ? 'btn-secondary' : 'btn-danger')} onClick={() => handleFlag(a.id)}>
                              {a.flagged ? 'Unflag' : '🚩'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {viewDetail && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setViewDetail(null)}>
          <div className="modal" style={{ maxWidth: 700 }}>
            <div className="modal-header">
              <h3>Attempt Detail</h3>
              <div className="gap-8">
                {viewDetail.status === 'completed' && (
                  <button className={'btn btn-sm ' + (viewDetail.flagged ? 'btn-secondary' : 'btn-danger')} onClick={() => handleFlag(viewDetail.id)}>
                    {viewDetail.flagged ? 'Unflag' : '🚩 Flag'}
                  </button>
                )}
                <button className="btn btn-ghost btn-sm" onClick={() => setViewDetail(null)}>✕</button>
              </div>
            </div>
            <div className="grid-2 mb-16">
              <div style={{ background: 'var(--bg2)', borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>CANDIDATE</div>
                <div style={{ fontWeight: 700 }}>{viewDetail.user?.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>📍 {viewDetail.user?.district}</div>
              </div>
              <div style={{ background: 'var(--bg2)', borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>ASSESSMENT</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{viewDetail.questionSet?.title}</div>
              </div>
            </div>
            {viewDetail.status === 'completed' && (
              <>
                <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                  {[
                    { label: 'Score', value: viewDetail.score + '/' + viewDetail.totalMarks, sub: viewDetail.percentage + '%', color: getScoreColor(viewDetail.percentage) },
                    { label: 'Trust', value: viewDetail.trustScore, sub: 'TrustMesh', color: '#60a5fa' },
                    { label: 'Fitment', value: fitmentConfig[viewDetail.fitmentCategory]?.icon, sub: fitmentConfig[viewDetail.fitmentCategory]?.label, color: fitmentConfig[viewDetail.fitmentCategory]?.color },
                  ].map(item => (
                    <div key={item.label} style={{ flex: 1, minWidth: 100, background: 'var(--bg2)', borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: item.color }}>{item.value}</div>
                      {item.sub && <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{item.sub}</div>}
                      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{item.label}</div>
                    </div>
                  ))}
                </div>
                {viewDetail.aiAnalysis && (
                  <div style={{ background: 'var(--bg2)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent2)', marginBottom: 12 }}>🤖 AI ANALYSIS</div>
                    {Object.entries(viewDetail.aiAnalysis).map(([k, v]) => (
                      <div key={k} className="chart-bar-row">
                        <div className="chart-bar-label" style={{ fontSize: 12, textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</div>
                        <div className="chart-bar-wrap"><div className="progress-bar"><div className="progress-fill blue" style={{ width: v + '%' }} /></div></div>
                        <div className="chart-bar-value">{Math.round(v)}%</div>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                  <span style={{ color: viewDetail.faceVerified ? 'var(--success)' : 'var(--danger)' }}>{viewDetail.faceVerified ? '✅' : '❌'} Face</span>
                  <span style={{ color: viewDetail.voiceVerified ? 'var(--success)' : 'var(--danger)' }}>{viewDetail.voiceVerified ? '✅' : '❌'} Voice</span>
                  <span style={{ color: viewDetail.flagged ? 'var(--danger)' : 'var(--success)' }}>{viewDetail.flagged ? '🚫 Flagged' : '✅ Clean'}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
