import React, { useState, useEffect, useRef, useCallback } from 'react';
import { candidateAPI } from '../utils/api';
import { fitmentConfig, getScoreColor } from '../utils/helpers';

function TimerBadge({ seconds }) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const cls = seconds < 60 ? 'danger' : seconds < 180 ? 'warning' : '';
  return (
    <div className={`timer-badge ${cls}`}>
      ⏱️ {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </div>
  );
}

function TrustMeshAnimation({ score }) {
  return (
    <div style={{ textAlign: 'center', padding: '24px 0' }}>
      <div style={{ width: 80, height: 80, margin: '0 auto 16px', borderRadius: '50%', background: `conic-gradient(var(--accent2) ${score}%, var(--surface2) 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, fontFamily: 'Syne, sans-serif', color: 'var(--accent2)' }}>
          {score}
        </div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent2)' }}>TrustMesh Score</div>
      <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>Identity Verified</div>
    </div>
  );
}

export default function AssessmentPage({ questionSet, onComplete, onBack }) {
  const [attemptId, setAttemptId] = useState(null);
  const [phase, setPhase] = useState('verify'); // verify | questions | submitted | result
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(questionSet.timeLimit * 60);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  const [voiceVerified, setVoiceVerified] = useState(false);
  const [verifyStep, setVerifyStep] = useState(0); // 0=face, 1=voice, 2=done
  const [trustScore] = useState(Math.floor(75 + Math.random() * 25));
  const timerRef = useRef();
  const { id: qsId, questions } = questionSet;

  // Start attempt
  useEffect(() => {
    if (phase === 'questions' && !attemptId) {
      candidateAPI.startAttempt({ userId: questionSet._userId, questionSetId: qsId })
        .then(a => setAttemptId(a.id))
        .catch(err => alert(err.message));
    }
  }, [phase, attemptId, qsId, questionSet._userId]);

  const handleAnswer = (qId, optIdx) => {
    setAnswers(a => ({ ...a, [qId]: optIdx }));
  };

  const handleSubmit = useCallback(async (autoSubmit = false) => {
    if (!autoSubmit && !window.confirm('Submit your assessment? You cannot change answers after submission.')) return;
    clearInterval(timerRef.current);
    setSubmitting(true);
    try {
      const res = await candidateAPI.submitAttempt(attemptId, {
        answers, faceVerified, voiceVerified, trustScore
      });
      setResult(res);
      setPhase('result');
    } catch (err) { alert(err.message); }
    setSubmitting(false);
  }, [attemptId, answers, faceVerified, voiceVerified, trustScore]);

  // Timer
  useEffect(() => {
    if (phase !== 'questions') return;
    timerRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) { clearInterval(timerRef.current); handleSubmit(true); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, attemptId, handleSubmit]);

  // ── These must be declared BEFORE any conditional returns ──
  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? ((currentQ + 1) / questions.length) * 100 : 0;
  const q = questions[currentQ];

  // ── VERIFY PHASE ──────────────────────────────────────────────────────────
  if (phase === 'verify') {
    return (
      <div style={{ maxWidth: 560, margin: '0 auto', padding: 32 }}>
        <button className="btn btn-ghost btn-sm mb-24" onClick={onBack}>← Back</button>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔐</div>
          <h2 style={{ marginBottom: 8 }}>TrustMesh Verification</h2>
          <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 24 }}>
            Complete identity verification before starting: <strong>{questionSet.title}</strong>
          </p>

          {verifyStep === 0 && (
            <div>
              <div style={{ background: 'var(--bg2)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>👤</div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Face Verification</div>
                <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>Position your face in the camera frame. AI will verify your identity.</p>
                <div style={{ background: 'var(--surface2)', borderRadius: 8, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, border: '2px dashed var(--border)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ fontSize: 13, color: 'var(--text3)' }}>📸 Camera Preview Area</div>
                  <div style={{ position: 'absolute', inset: 10, border: '2px solid rgba(59,130,246,0.3)', borderRadius: 8 }} />
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { setFaceVerified(true); setVerifyStep(1); }}>
                  ✅ Verify Face (Simulated)
                </button>
              </div>
            </div>
          )}

          {verifyStep === 1 && (
            <div>
              <div style={{ background: 'var(--bg2)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🎤</div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Voice Verification</div>
                <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>Say: "ನನ್ನ ಹೆಸರು [Name] ಮತ್ತು ನಾನು ಇಂದು ಪರೀಕ್ಷೆ ನೀಡಲು ಸಿದ್ಧ"</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 12 }}>
                  {[...Array(20)].map((_, i) => <div key={i} style={{ width: 4, height: Math.random() * 30 + 10, background: 'var(--accent2)', borderRadius: 2, animation: 'pulse 0.8s infinite', animationDelay: `${i * 0.05}s` }} />)}
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { setVoiceVerified(true); setVerifyStep(2); }}>
                  ✅ Verify Voice (Simulated)
                </button>
              </div>
            </div>
          )}

          {verifyStep === 2 && (
            <div>
              <TrustMeshAnimation score={trustScore} />
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ color: 'var(--success)', fontSize: 13 }}>✅ Face Verified</div>
                <div style={{ color: 'var(--success)', fontSize: 13 }}>✅ Voice Verified</div>
              </div>
              <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 13, color: '#34d399' }}>
                🎉 Identity verified successfully! TrustMesh score: <strong>{trustScore}/100</strong>
              </div>
              <div style={{ background: 'var(--bg2)', borderRadius: 8, padding: 14, marginBottom: 20, fontSize: 13, color: 'var(--text2)', textAlign: 'left' }}>
                <div style={{ fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>📋 Assessment Rules</div>
                <div>• {questions.length} questions · {questionSet.timeLimit} minutes</div>
                <div>• Total marks: {questionSet.totalMarks} · Pass: {questionSet.passingMarks}</div>
                <div>• Do not close the browser during assessment</div>
                <div>• Each question must be answered only once</div>
              </div>
              <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => setPhase('questions')}>
                🚀 Start Assessment
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── RESULT PHASE ──────────────────────────────────────────────────────────
  if (phase === 'result' && result) {
    const fitment = fitmentConfig[result.fitmentCategory] || fitmentConfig['pending'];
    const passed = result.score >= questionSet.passingMarks;
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: 32 }}>
        <div className="card" style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>{fitment.icon}</div>
          <h2 style={{ marginBottom: 4 }}>{passed ? 'Assessment Complete! 🎉' : 'Assessment Complete'}</h2>
          <p style={{ color: 'var(--text2)', marginBottom: 24 }}>{questionSet.title}</p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'Score', value: `${result.score}/${result.totalMarks}`, sub: `${result.percentage}%`, color: getScoreColor(result.percentage) },
              { label: 'Trust Score', value: result.trustScore, color: '#60a5fa' },
              { label: 'Status', value: fitment.icon, sub: fitment.label, color: fitment.color },
            ].map(item => (
              <div key={item.label} style={{ background: 'var(--bg2)', borderRadius: 12, padding: '16px 20px', minWidth: 100 }}>
                <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: item.color, lineHeight: 1 }}>{item.value}</div>
                {item.sub && <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{item.sub}</div>}
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{item.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: `${fitment.color}1a`, border: `1px solid ${fitment.color}40`, borderRadius: 10, padding: 14, marginBottom: 20, fontSize: 14 }}>
            <strong style={{ color: fitment.color }}>{fitment.label}</strong>
            <p style={{ color: 'var(--text2)', fontSize: 13, marginTop: 4 }}>
              {result.fitmentCategory === 'job-ready' && 'Excellent! You are ready for immediate placement. The admin will contact you with job opportunities.'}
              {result.fitmentCategory === 'requires-training' && 'Good effort! You need some additional training. You will be enrolled in upskilling programs in your district.'}
              {result.fitmentCategory === 'requires-manual-verification' && 'Your profile needs manual review. A district officer will contact you within 3 working days.'}
              {result.fitmentCategory === 'low-confidence' && 'Please try again after preparation. You may retake the assessment after 7 days.'}
              {result.fitmentCategory === 'fraud-suspected' && 'Suspicious activity detected. This attempt has been flagged for review.'}
            </p>
          </div>

          {result.aiAnalysis && (
            <div style={{ textAlign: 'left', background: 'var(--bg2)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent2)', marginBottom: 12 }}>🤖 AI Performance Analysis</div>
              {Object.entries(result.aiAnalysis).map(([k, v]) => (
                <div key={k} className="chart-bar-row">
                  <div className="chart-bar-label" style={{ fontSize: 12, textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</div>
                  <div className="chart-bar-wrap"><div className="progress-bar"><div className="progress-fill blue" style={{ width: `${v}%` }} /></div></div>
                  <div className="chart-bar-value">{Math.round(v)}%</div>
                </div>
              ))}
            </div>
          )}

          <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={onComplete}>
            Back to Dashboard
          </button>
        </div>

        {/* Answer Review */}
        <h3 style={{ fontFamily: 'Syne, sans-serif', marginBottom: 16 }}>Answer Review</h3>
        {questions.map((ques, i) => {
          const userAns = answers[ques.id];
          const isCorrect = userAns === ques.correct;
          return (
            <div key={ques.id} className="card" style={{ marginBottom: 12, padding: '16px 18px' }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                <span style={{ color: isCorrect ? 'var(--success)' : 'var(--danger)', fontSize: 16 }}>{isCorrect ? '✅' : '❌'}</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Q{i + 1}. {ques.text}</span>
              </div>
              {ques.options.map((opt, oi) => (
                <div key={oi} style={{ padding: '6px 10px', borderRadius: 6, marginBottom: 4, fontSize: 13, display: 'flex', gap: 8, background: oi === ques.correct ? 'rgba(16,185,129,0.1)' : oi === userAns ? 'rgba(239,68,68,0.1)' : 'transparent', color: oi === ques.correct ? 'var(--success)' : oi === userAns ? 'var(--danger)' : 'var(--text2)' }}>
                  <span style={{ fontWeight: 700 }}>{String.fromCharCode(65 + oi)}.</span> {opt}
                  {oi === ques.correct && ' ✓ Correct'}
                  {oi === userAns && oi !== ques.correct && ' ✗ Your Answer'}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  // ── QUESTIONS PHASE ───────────────────────────────────────────────────────
  return (
    <div className="assessment-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 2 }}>{questionSet.title}</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Question {currentQ + 1} of {questions.length}</div>
        </div>
        <TimerBadge seconds={secondsLeft} />
      </div>

      {/* Progress */}
      <div className="progress-bar" style={{ marginBottom: 24, height: 6 }}>
        <div className="progress-fill blue" style={{ width: `${progress}%` }} />
      </div>

      {/* Question Card */}
      <div className="question-card">
        <div className="question-number">Question {currentQ + 1} · {q.marks} marks</div>
        <div className="question-text">{q.text}</div>
        {q.options.map((opt, i) => (
          <div key={i} className={`option-item ${answers[q.id] === i ? 'selected' : ''}`} onClick={() => handleAnswer(q.id, i)}>
            <div className="option-label">{String.fromCharCode(65 + i)}</div>
            <div style={{ fontSize: 14 }}>{opt}</div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
        <button className="btn btn-ghost" onClick={() => setCurrentQ(q => Math.max(0, q - 1))} disabled={currentQ === 0}>
          ← Previous
        </button>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', maxWidth: 300 }}>
          {questions.map((_, i) => (
            <div key={i} onClick={() => setCurrentQ(i)} style={{ width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, cursor: 'pointer', background: answers[questions[i].id] !== undefined ? 'var(--accent)' : i === currentQ ? 'var(--surface2)' : 'var(--bg2)', color: answers[questions[i].id] !== undefined || i === currentQ ? 'white' : 'var(--text3)', border: `1px solid ${i === currentQ ? 'var(--accent)' : 'var(--border)'}` }}>
              {i + 1}
            </div>
          ))}
        </div>

        {currentQ === questions.length - 1 ? (
          <button className="btn btn-success" onClick={() => handleSubmit(false)} disabled={submitting}>
            {submitting ? 'Submitting...' : `Submit (${answeredCount}/${questions.length})`}
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => setCurrentQ(q => Math.min(questions.length - 1, q + 1))}>
            Next →
          </button>
        )}
      </div>

      <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text3)', marginTop: 16 }}>
        {answeredCount} of {questions.length} answered
      </div>
    </div>
  );
}