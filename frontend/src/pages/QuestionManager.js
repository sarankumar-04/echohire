import React, { useState, useEffect } from 'react';
import { qsAPI, adminAPI } from '../utils/api';
import { categoryConfig, languageConfig, formatDate } from '../utils/helpers';

const EMPTY_QUESTION = { text: '', options: ['', '', '', ''], correct: 0, marks: 10 };

export default function QuestionManager() {
  const [sets, setSets] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showAssign, setShowAssign] = useState(null);
  const [viewSet, setViewSet] = useState(null);

  const [form, setForm] = useState({
    title: '', description: '', category: 'blue-collar', language: 'kn',
    timeLimit: 30, passingMarks: 42,
    questions: [{ ...EMPTY_QUESTION, options: ['', '', '', ''] }]
  });

  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    Promise.all([qsAPI.getAll(), adminAPI.getCandidates()])
      .then(([s, c]) => { setSets(s); setCandidates(c); })
      .finally(() => setLoading(false));
  }, []);

  const addQuestion = () => setForm(f => ({ ...f, questions: [...f.questions, { ...EMPTY_QUESTION, options: ['', '', '', ''] }] }));
  const removeQuestion = (i) => setForm(f => ({ ...f, questions: f.questions.filter((_, j) => j !== i) }));

  const setQ = (i, k, v) => setForm(f => {
    const qs = [...f.questions];
    qs[i] = { ...qs[i], [k]: v };
    return { ...f, questions: qs };
  });

  const setOpt = (qi, oi, v) => setForm(f => {
    const qs = [...f.questions];
    const opts = [...qs[qi].options];
    opts[oi] = v;
    qs[qi] = { ...qs[qi], options: opts };
    return { ...f, questions: qs };
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    const totalMarks = form.questions.reduce((s, q) => s + Number(q.marks), 0);
    try {
      const newSet = await qsAPI.create({ ...form, totalMarks });
      setSets(s => [...s, newSet]);
      setShowCreate(false);
      setForm({ title: '', description: '', category: 'blue-collar', language: 'kn', timeLimit: 30, passingMarks: 42, questions: [{ ...EMPTY_QUESTION, options: ['', '', '', ''] }] });
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question set?')) return;
    await qsAPI.delete(id);
    setSets(s => s.filter(x => x.id !== id));
  };

  const handleAssign = async () => {
    if (!selectedUsers.length) return alert('Select at least one user');
    await qsAPI.assign(showAssign.id, selectedUsers);
    setSets(s => s.map(x => x.id === showAssign.id ? { ...x, assignedTo: [...new Set([...(x.assignedTo || []), ...selectedUsers])] } : x));
    setShowAssign(null);
    setSelectedUsers([]);
    alert(`✅ Assigned to ${selectedUsers.length} candidate(s) successfully!`);
  };

  if (loading) return <div className="page-body"><div className="loading-shimmer" style={{ height: 200 }} /></div>;

  return (
    <>
      <div className="page-header">
        <div className="flex-between">
          <div>
            <h2>Question Sets</h2>
            <p>Create, manage and assign MCQ assessments to candidates</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ Create Question Set</button>
        </div>
      </div>

      <div className="page-body">
        {sets.length === 0 ? (
          <div className="empty-state"><div style={{ fontSize: 48 }}>📝</div><p>No question sets yet</p></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {sets.map(s => (
              <div key={s.id} className="card" style={{ padding: '18px 20px' }}>
                <div className="flex-between">
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontWeight: 800, fontSize: 15, fontFamily: 'Syne, sans-serif' }}>{s.title}</span>
                      <span className="badge badge-cyan">{categoryConfig[s.category]?.icon} {categoryConfig[s.category]?.label}</span>
                      <span className="badge badge-blue">{languageConfig[s.language]?.flag} {languageConfig[s.language]?.label}</span>
                      <span className={`badge ${s.status === 'active' ? 'badge-green' : 'badge-gray'}`}>{s.status}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 8 }}>{s.description}</div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text3)' }}>
                      <span>❓ {s.questions?.length} Questions</span>
                      <span>📊 {s.totalMarks} Total Marks</span>
                      <span>✅ Pass: {s.passingMarks}</span>
                      <span>⏱️ {s.timeLimit} min</span>
                      <span>👥 {s.assignedTo?.length || 0} Assigned</span>
                      <span>📅 {formatDate(s.createdAt)}</span>
                    </div>
                  </div>
                  <div className="gap-8" style={{ flexShrink: 0, marginLeft: 16 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setViewSet(s)}>👁 View</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setShowAssign(s)}>👥 Assign</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>🗑</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {showCreate && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowCreate(false)}>
          <div className="modal" style={{ maxWidth: 700 }}>
            <div className="modal-header">
              <h3>Create Question Set</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowCreate(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="grid-2">
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Title *</label>
                  <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="Assessment title" />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Description</label>
                  <input className="form-input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {Object.entries(categoryConfig).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Language</label>
                  <select className="form-select" value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))}>
                    {Object.entries(languageConfig).map(([k, v]) => <option key={k} value={k}>{v.flag} {v.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Time Limit (minutes)</label>
                  <input className="form-input" type="number" min="5" max="120" value={form.timeLimit} onChange={e => setForm(f => ({ ...f, timeLimit: Number(e.target.value) }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Passing Marks</label>
                  <input className="form-input" type="number" min="0" value={form.passingMarks} onChange={e => setForm(f => ({ ...f, passingMarks: Number(e.target.value) }))} />
                </div>
              </div>

              <div className="divider" />
              <div className="flex-between mb-16">
                <strong style={{ fontFamily: 'Syne, sans-serif' }}>Questions ({form.questions.length})</strong>
                <button type="button" className="btn btn-secondary btn-sm" onClick={addQuestion}>+ Add Question</button>
              </div>

              {form.questions.map((q, i) => (
                <div key={i} style={{ background: 'var(--bg2)', borderRadius: 10, padding: 16, marginBottom: 14, border: '1px solid var(--border)' }}>
                  <div className="flex-between mb-8">
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent2)' }}>Q{i + 1}</span>
                    <div className="gap-8">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <label style={{ fontSize: 11, color: 'var(--text3)' }}>Marks:</label>
                        <input type="number" min="1" max="50" style={{ width: 60, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', color: 'var(--text)', fontSize: 12 }} value={q.marks} onChange={e => setQ(i, 'marks', Number(e.target.value))} />
                      </div>
                      {form.questions.length > 1 && <button type="button" className="btn btn-danger btn-sm" onClick={() => removeQuestion(i)}>✕</button>}
                    </div>
                  </div>
                  <div className="form-group">
                    <input className="form-input" placeholder="Question text (can be in Kannada/Hindi/English)" value={q.text} onChange={e => setQ(i, 'text', e.target.value)} required />
                  </div>
                  {q.options.map((opt, oi) => (
                    <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <input type="radio" name={`correct-${i}`} checked={q.correct === oi} onChange={() => setQ(i, 'correct', oi)} />
                      <span style={{ fontSize: 12, color: q.correct === oi ? 'var(--success)' : 'var(--text3)', width: 20, fontWeight: 700 }}>{String.fromCharCode(65 + oi)}</span>
                      <input className="form-input" style={{ flex: 1 }} placeholder={`Option ${String.fromCharCode(65 + oi)}`} value={opt} onChange={e => setOpt(i, oi, e.target.value)} required />
                      {q.correct === oi && <span style={{ color: 'var(--success)', fontSize: 14 }}>✓</span>}
                    </div>
                  ))}
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>Select radio button to mark correct answer</div>
                </div>
              ))}

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Question Set</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN MODAL */}
      {showAssign && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowAssign(null)}>
          <div className="modal">
            <div className="modal-header">
              <h3>Assign to Candidates</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAssign(null)}>✕</button>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>
              Assigning: <strong>{showAssign.title}</strong>
            </p>
            <div style={{ maxHeight: 320, overflowY: 'auto' }}>
              {candidates.map(c => (
                <div key={c.id} onClick={() => setSelectedUsers(u => u.includes(c.id) ? u.filter(x => x !== c.id) : [...u, c.id])}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, cursor: 'pointer', marginBottom: 6, background: selectedUsers.includes(c.id) ? 'rgba(59,130,246,0.1)' : 'var(--bg2)', border: `1px solid ${selectedUsers.includes(c.id) ? 'var(--accent)' : 'var(--border)'}`, transition: 'all 0.15s' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                    {c.name?.[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>📍 {c.district} · {categoryConfig[c.skillCategory]?.icon} {categoryConfig[c.skillCategory]?.label}</div>
                  </div>
                  {showAssign.assignedTo?.includes(c.id) && <span className="badge badge-green" style={{ fontSize: 10 }}>Already Assigned</span>}
                  {selectedUsers.includes(c.id) && <span style={{ color: 'var(--accent)', fontSize: 18 }}>✓</span>}
                </div>
              ))}
            </div>
            <div className="flex-between" style={{ marginTop: 16 }}>
              <span style={{ fontSize: 13, color: 'var(--text2)' }}>{selectedUsers.length} selected</span>
              <div className="gap-8">
                <button className="btn btn-ghost" onClick={() => setShowAssign(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleAssign}>Assign ({selectedUsers.length})</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewSet && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setViewSet(null)}>
          <div className="modal" style={{ maxWidth: 700 }}>
            <div className="modal-header">
              <h3>{viewSet.title}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setViewSet(null)}>✕</button>
            </div>
            {viewSet.questions?.map((q, i) => (
              <div key={q.id} style={{ background: 'var(--bg2)', borderRadius: 10, padding: 14, marginBottom: 12, border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14 }}>Q{i + 1}. {q.text} <span style={{ color: 'var(--text3)', fontSize: 12 }}>({q.marks} marks)</span></div>
                {q.options.map((opt, oi) => (
                  <div key={oi} style={{ padding: '6px 10px', borderRadius: 6, marginBottom: 4, fontSize: 13, background: q.correct === oi ? 'rgba(16,185,129,0.1)' : 'transparent', color: q.correct === oi ? 'var(--success)' : 'var(--text2)', display: 'flex', gap: 8 }}>
                    <span style={{ fontWeight: 700 }}>{String.fromCharCode(65 + oi)}.</span> {opt}
                    {q.correct === oi && <span>✓</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
