const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(morgan('dev'));

// ─── IN-MEMORY DATABASE ───────────────────────────────────────────────────────
const db = {
  users: [
    { id: 'admin-1', username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User', district: 'Bengaluru', email: 'admin@echohire.gov.in' },
    { id: 'user-1', username: 'ramesh', password: 'pass123', role: 'candidate', name: 'Ramesh Kumar', district: 'Mysuru', email: 'ramesh@example.com', phone: '9876543210', language: 'kn', skillCategory: 'blue-collar', registered: new Date('2024-01-10').toISOString() },
    { id: 'user-2', username: 'priya', password: 'pass123', role: 'candidate', name: 'Priya Devi', district: 'Dharwad', email: 'priya@example.com', phone: '9876543211', language: 'en', skillCategory: 'polytechnic', registered: new Date('2024-01-15').toISOString() },
    { id: 'user-3', username: 'suresh', password: 'pass123', role: 'candidate', name: 'Suresh Patil', district: 'Belagavi', email: 'suresh@example.com', phone: '9876543212', language: 'hi', skillCategory: 'semi-skilled', registered: new Date('2024-01-20').toISOString() },
    { id: 'user-4', username: 'kavitha', password: 'pass123', role: 'candidate', name: 'Kavitha S', district: 'Mangaluru', email: 'kavitha@example.com', phone: '9876543213', language: 'kn', skillCategory: 'blue-collar', registered: new Date('2024-02-01').toISOString() },
    { id: 'user-5', username: 'arjun', password: 'pass123', role: 'candidate', name: 'Arjun Nayak', district: 'Tumakuru', email: 'arjun@example.com', phone: '9876543214', language: 'en', skillCategory: 'polytechnic', registered: new Date('2024-02-05').toISOString() },
  ],
  questionSets: [
    {
      id: 'qs-1',
      title: 'Blue Collar Skill Assessment - Basic',
      description: 'Assessment for welding, fabrication and mechanical trade workers',
      category: 'blue-collar',
      language: 'kn',
      createdBy: 'admin-1',
      createdAt: new Date('2024-01-01').toISOString(),
      assignedTo: ['user-1', 'user-4'],
      questions: [
        { id: 'q1', text: 'ನಿಮ್ಮ ವೃತ್ತಿ ಅನುಭವದ ಬಗ್ಗೆ ತಿಳಿಸಿ (Tell us about your work experience)', textEn: 'Tell us about your work experience', type: 'mcq', options: ['0-1 ವರ್ಷ / 0-1 Years', '1-3 ವರ್ಷ / 1-3 Years', '3-5 ವರ್ಷ / 3-5 Years', '5+ ವರ್ಷ / 5+ Years'], correct: 0, marks: 10 },
        { id: 'q2', text: 'ನೀವು ಯಾವ ಉಪಕರಣಗಳನ್ನು ಬಳಸಬಲ್ಲಿರಿ? (Which tools can you operate?)', textEn: 'Which tools can you operate?', type: 'mcq', options: ['Welding Machine', 'Lathe Machine', 'Drilling Machine', 'All of the above'], correct: 3, marks: 15 },
        { id: 'q3', text: 'ಸುರಕ್ಷತಾ ಪ್ರೋಟೋಕಾಲ್ ಅನ್ನು ನೀವು ಅನುಸರಿಸುತ್ತೀರಾ? (Do you follow safety protocols?)', textEn: 'Do you follow safety protocols?', type: 'mcq', options: ['ಯಾವಾಗಲೂ / Always', 'ಕೆಲವೊಮ್ಮೆ / Sometimes', 'ಅಪರೂಪ / Rarely', 'ಇಲ್ಲ / Never'], correct: 0, marks: 20 },
        { id: 'q4', text: 'PPE (Personal Protective Equipment) ಎಂದರೇನು?', textEn: 'What is PPE?', type: 'mcq', options: ['Personal Protective Equipment', 'Professional Performance Evaluation', 'Physical Plant Engineering', 'None'], correct: 0, marks: 15 },
        { id: 'q5', text: 'ನೀವು ಟೀಮ್‌ನಲ್ಲಿ ಕೆಲಸ ಮಾಡುತ್ತೀರಾ? (Can you work in a team?)', textEn: 'Can you work in a team?', type: 'mcq', options: ['ಹೌದು, ಯಾವಾಗಲೂ / Yes, Always', 'ಹೌದು, ಕೆಲವೊಮ್ಮೆ / Yes, Sometimes', 'ಇಲ್ಲ / No', 'ಅನುಭವ ಇಲ್ಲ / No Experience'], correct: 0, marks: 10 },
      ],
      totalMarks: 70,
      passingMarks: 42,
      timeLimit: 30,
      status: 'active'
    },
    {
      id: 'qs-2',
      title: 'Polytechnic Technical Assessment',
      description: 'For diploma holders in Electrical, Mechanical, Civil engineering',
      category: 'polytechnic',
      language: 'en',
      createdBy: 'admin-1',
      createdAt: new Date('2024-01-05').toISOString(),
      assignedTo: ['user-2', 'user-5'],
      questions: [
        { id: 'q1', text: 'What is Ohm\'s Law?', type: 'mcq', options: ['V = IR', 'P = IV', 'F = ma', 'E = mc²'], correct: 0, marks: 20 },
        { id: 'q2', text: 'Which material is best conductor of electricity?', type: 'mcq', options: ['Iron', 'Copper', 'Aluminium', 'Gold'], correct: 1, marks: 15 },
        { id: 'q3', text: 'What is the function of a transformer?', type: 'mcq', options: ['Convert AC to DC', 'Store electrical energy', 'Change voltage levels', 'Measure current'], correct: 2, marks: 20 },
        { id: 'q4', text: 'AutoCAD is used for:', type: 'mcq', options: ['Accounting', 'Computer-Aided Design', 'Database Management', 'Programming'], correct: 1, marks: 15 },
        { id: 'q5', text: 'What does PLC stand for?', type: 'mcq', options: ['Programmable Logic Controller', 'Power Line Communication', 'Parallel Load Calculation', 'Physical Layer Circuit'], correct: 0, marks: 20 },
        { id: 'q6', text: 'What is the SI unit of frequency?', type: 'mcq', options: ['Watt', 'Joule', 'Hertz', 'Newton'], correct: 2, marks: 10 },
      ],
      totalMarks: 100,
      passingMarks: 60,
      timeLimit: 40,
      status: 'active'
    },
    {
      id: 'qs-3',
      title: 'Semi-Skilled General Assessment',
      description: 'General aptitude and awareness for semi-skilled workers',
      category: 'semi-skilled',
      language: 'hi',
      createdBy: 'admin-1',
      createdAt: new Date('2024-01-10').toISOString(),
      assignedTo: ['user-3'],
      questions: [
        { id: 'q1', text: 'आपकी शैक्षिक योग्यता क्या है? (What is your education?)', type: 'mcq', options: ['10th Pass', '12th Pass', 'ITI/Diploma', 'Graduate'], correct: 0, marks: 10 },
        { id: 'q2', text: 'आप कितने घंटे काम कर सकते हैं? (How many hours can you work?)', type: 'mcq', options: ['4 Hours', '6 Hours', '8 Hours', '10+ Hours'], correct: 2, marks: 10 },
        { id: 'q3', text: 'Basic computer knowledge do you have?', type: 'mcq', options: ['None', 'Basic (MS Office)', 'Intermediate', 'Advanced'], correct: 1, marks: 15 },
        { id: 'q4', text: 'क्या आपके पास वाहन चलाने का लाइसेंस है? (Do you have a driving licence?)', type: 'mcq', options: ['हाँ - 2 Wheeler', 'हाँ - 4 Wheeler', 'दोनों', 'नहीं'], correct: 0, marks: 10 },
        { id: 'q5', text: 'आप नया काम सीखने के लिए तैयार हैं? (Are you ready to learn new skills?)', type: 'mcq', options: ['हाँ, बिल्कुल / Yes, Definitely', 'हाँ, थोड़ा / Yes, Somewhat', 'नहीं / No', 'पता नहीं / Not Sure'], correct: 0, marks: 15 },
      ],
      totalMarks: 60,
      passingMarks: 36,
      timeLimit: 25,
      status: 'active'
    }
  ],
  attempts: [
    {
      id: 'att-1', userId: 'user-1', questionSetId: 'qs-1', startTime: new Date('2024-02-10T09:00:00').toISOString(),
      endTime: new Date('2024-02-10T09:25:00').toISOString(), status: 'completed',
      answers: { q1: 1, q2: 3, q3: 0, q4: 0, q5: 0 },
      score: 60, totalMarks: 70, percentage: 85.7,
      fitmentCategory: 'job-ready', trustScore: 92,
      flagged: false, duplicate: false,
      videoUrl: null, faceVerified: true, voiceVerified: true,
      aiAnalysis: { communicationScore: 88, relevanceScore: 90, confidenceScore: 85, overallScore: 87.7 }
    },
    {
      id: 'att-2', userId: 'user-2', questionSetId: 'qs-2', startTime: new Date('2024-02-12T10:00:00').toISOString(),
      endTime: new Date('2024-02-12T10:35:00').toISOString(), status: 'completed',
      answers: { q1: 0, q2: 1, q3: 2, q4: 1, q5: 0, q6: 2 },
      score: 80, totalMarks: 100, percentage: 80,
      fitmentCategory: 'job-ready', trustScore: 88,
      flagged: false, duplicate: false,
      videoUrl: null, faceVerified: true, voiceVerified: true,
      aiAnalysis: { communicationScore: 82, relevanceScore: 85, confidenceScore: 79, overallScore: 82 }
    },
    {
      id: 'att-3', userId: 'user-3', questionSetId: 'qs-3', startTime: new Date('2024-02-14T11:00:00').toISOString(),
      endTime: new Date('2024-02-14T11:20:00').toISOString(), status: 'completed',
      answers: { q1: 0, q2: 2, q3: 1, q4: 0, q5: 1 },
      score: 35, totalMarks: 60, percentage: 58.3,
      fitmentCategory: 'requires-training', trustScore: 75,
      flagged: false, duplicate: false,
      videoUrl: null, faceVerified: true, voiceVerified: false,
      aiAnalysis: { communicationScore: 60, relevanceScore: 65, confidenceScore: 58, overallScore: 61 }
    },
    {
      id: 'att-4', userId: 'user-4', questionSetId: 'qs-1', startTime: new Date('2024-02-15T14:00:00').toISOString(),
      endTime: new Date('2024-02-15T14:28:00').toISOString(), status: 'completed',
      answers: { q1: 0, q2: 2, q3: 0, q4: 0, q5: 0 },
      score: 55, totalMarks: 70, percentage: 78.6,
      fitmentCategory: 'job-ready', trustScore: 80,
      flagged: false, duplicate: false,
      videoUrl: null, faceVerified: true, voiceVerified: true,
      aiAnalysis: { communicationScore: 78, relevanceScore: 80, confidenceScore: 75, overallScore: 77.7 }
    },
    {
      id: 'att-5', userId: 'user-5', questionSetId: 'qs-2', startTime: new Date('2024-02-16T09:30:00').toISOString(),
      endTime: null, status: 'in-progress',
      answers: {}, score: 0, totalMarks: 100, percentage: 0,
      fitmentCategory: 'pending', trustScore: 0,
      flagged: false, duplicate: false,
      videoUrl: null, faceVerified: false, voiceVerified: false,
      aiAnalysis: null
    }
  ]
};

// ─── AI SCORING ENGINE ────────────────────────────────────────────────────────
function calculateFitment(percentage, trustScore, faceVerified, voiceVerified, flagged) {
  if (flagged) return 'fraud-suspected';
  if (!faceVerified || trustScore < 40) return 'low-confidence';
  if (percentage >= 75 && trustScore >= 80) return 'job-ready';
  if (percentage >= 50 && percentage < 75) return 'requires-training';
  if (percentage < 50 && trustScore >= 60) return 'requires-manual-verification';
  return 'low-confidence';
}

function calculateAIScore(answers, questions) {
  // Simulate AI analysis scores
  const correctCount = Object.keys(answers).filter((qId, i) => {
    const q = questions.find(q => q.id === qId);
    return q && answers[qId] === q.correct;
  }).length;
  const base = questions.length > 0 ? (correctCount / questions.length) * 100 : 0;
  return {
    communicationScore: Math.min(100, base + (Math.random() * 10 - 5)),
    relevanceScore: Math.min(100, base + (Math.random() * 8 - 4)),
    confidenceScore: Math.min(100, base + (Math.random() * 12 - 6)),
    overallScore: base
  };
}

// ─── AUTH ROUTES ─────────────────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const { password: _, ...safeUser } = user;
  console.log(`\n[AUTH] LOGIN: ${user.name} (${user.role}) @ ${new Date().toISOString()}`);
  res.json({ user: safeUser, token: `token-${user.id}-${Date.now()}` });
});

app.post('/api/auth/register', (req, res) => {
  const { username, password, name, email, phone, district, language, skillCategory } = req.body;
  if (db.users.find(u => u.username === username)) return res.status(400).json({ error: 'Username already exists' });
  const newUser = { id: uuidv4(), username, password, role: 'candidate', name, email, phone, district, language, skillCategory, registered: new Date().toISOString() };
  db.users.push(newUser);
  const { password: _, ...safeUser } = newUser;
  console.log(`\n[REGISTER] New candidate: ${name} from ${district}`);
  res.json({ user: safeUser });
});

// ─── ADMIN ROUTES ─────────────────────────────────────────────────────────────
app.get('/api/admin/stats', (req, res) => {
  const candidates = db.users.filter(u => u.role === 'candidate');
  const completed = db.attempts.filter(a => a.status === 'completed');
  const jobReady = completed.filter(a => a.fitmentCategory === 'job-ready').length;
  const requiresTraining = completed.filter(a => a.fitmentCategory === 'requires-training').length;
  const fraudSuspected = completed.filter(a => a.fitmentCategory === 'fraud-suspected' || a.flagged).length;
  const lowConfidence = completed.filter(a => a.fitmentCategory === 'low-confidence').length;
  const byDistrict = {};
  candidates.forEach(c => { byDistrict[c.district] = (byDistrict[c.district] || 0) + 1; });
  const byCategory = {};
  candidates.forEach(c => { byCategory[c.skillCategory] = (byCategory[c.skillCategory] || 0) + 1; });
  res.json({
    totalCandidates: candidates.length, totalAssessments: completed.length,
    jobReady, requiresTraining, fraudSuspected, lowConfidence,
    avgScore: completed.reduce((s, a) => s + (a.percentage || 0), 0) / (completed.length || 1),
    avgTrust: completed.reduce((s, a) => s + (a.trustScore || 0), 0) / (completed.length || 1),
    byDistrict, byCategory,
    activeQuestionSets: db.questionSets.filter(qs => qs.status === 'active').length,
    pendingReview: db.attempts.filter(a => a.status === 'in-progress').length
  });
});

app.get('/api/admin/candidates', (req, res) => {
  const { district, category, fitment } = req.query;
  let candidates = db.users.filter(u => u.role === 'candidate').map(u => {
    const attempt = db.attempts.find(a => a.userId === u.id && a.status === 'completed');
    return { ...u, password: undefined, latestAttempt: attempt || null };
  });
  if (district) candidates = candidates.filter(c => c.district === district);
  if (category) candidates = candidates.filter(c => c.skillCategory === category);
  if (fitment) candidates = candidates.filter(c => c.latestAttempt?.fitmentCategory === fitment);
  res.json(candidates);
});

app.get('/api/admin/attempts', (req, res) => {
  const enriched = db.attempts.map(a => {
    const user = db.users.find(u => u.id === a.userId);
    const qs = db.questionSets.find(q => q.id === a.questionSetId);
    return { ...a, userName: user?.name, userDistrict: user?.district, questionSetTitle: qs?.title };
  });
  res.json(enriched);
});

app.get('/api/admin/attempts/:id', (req, res) => {
  const attempt = db.attempts.find(a => a.id === req.params.id);
  if (!attempt) return res.status(404).json({ error: 'Not found' });
  const user = db.users.find(u => u.id === attempt.userId);
  const qs = db.questionSets.find(q => q.id === attempt.questionSetId);
  res.json({ ...attempt, user, questionSet: qs });
});

app.patch('/api/admin/attempts/:id/flag', (req, res) => {
  const attempt = db.attempts.find(a => a.id === req.params.id);
  if (!attempt) return res.status(404).json({ error: 'Not found' });
  attempt.flagged = !attempt.flagged;
  if (attempt.flagged) attempt.fitmentCategory = 'fraud-suspected';
  console.log(`\n[FLAG] Attempt ${req.params.id} flagged=${attempt.flagged}`);
  res.json(attempt);
});

// ─── QUESTION SET ROUTES ──────────────────────────────────────────────────────
app.get('/api/questionsets', (req, res) => {
  res.json(db.questionSets);
});

app.get('/api/questionsets/:id', (req, res) => {
  const qs = db.questionSets.find(q => q.id === req.params.id);
  if (!qs) return res.status(404).json({ error: 'Not found' });
  res.json(qs);
});

app.post('/api/questionsets', (req, res) => {
  const { title, description, category, language, questions, timeLimit, passingMarks, assignedTo } = req.body;
  const totalMarks = questions.reduce((s, q) => s + (q.marks || 10), 0);
  const qs = {
    id: uuidv4(), title, description, category, language,
    questions: questions.map((q, i) => ({ ...q, id: `q${i + 1}` })),
    totalMarks, passingMarks: passingMarks || Math.round(totalMarks * 0.6),
    timeLimit: timeLimit || 30, assignedTo: assignedTo || [],
    createdBy: 'admin-1', createdAt: new Date().toISOString(), status: 'active'
  };
  db.questionSets.push(qs);
  console.log(`\n[QUESTIONSET] Created: "${title}" with ${questions.length} questions assigned to ${assignedTo?.length || 0} users`);
  res.json(qs);
});

app.put('/api/questionsets/:id', (req, res) => {
  const idx = db.questionSets.findIndex(q => q.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.questionSets[idx] = { ...db.questionSets[idx], ...req.body, id: req.params.id };
  res.json(db.questionSets[idx]);
});

app.delete('/api/questionsets/:id', (req, res) => {
  const idx = db.questionSets.findIndex(q => q.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.questionSets.splice(idx, 1);
  res.json({ success: true });
});

app.post('/api/questionsets/:id/assign', (req, res) => {
  const qs = db.questionSets.find(q => q.id === req.params.id);
  if (!qs) return res.status(404).json({ error: 'Not found' });
  const { userIds } = req.body;
  qs.assignedTo = [...new Set([...(qs.assignedTo || []), ...userIds])];
  console.log(`\n[ASSIGN] Question set "${qs.title}" assigned to users: ${userIds.join(', ')}`);
  res.json(qs);
});

// ─── CANDIDATE ROUTES ─────────────────────────────────────────────────────────
app.get('/api/candidate/:userId/assigned', (req, res) => {
  const assigned = db.questionSets.filter(qs => qs.assignedTo?.includes(req.params.userId) && qs.status === 'active');
  const withStatus = assigned.map(qs => {
    const attempt = db.attempts.find(a => a.userId === req.params.userId && a.questionSetId === qs.id);
    return { ...qs, attemptStatus: attempt?.status || 'not-started', attemptId: attempt?.id || null, score: attempt?.score, percentage: attempt?.percentage };
  });
  res.json(withStatus);
});

app.post('/api/attempts/start', (req, res) => {
  const { userId, questionSetId } = req.body;
  const existing = db.attempts.find(a => a.userId === userId && a.questionSetId === questionSetId && a.status === 'completed');
  if (existing) return res.status(400).json({ error: 'Already completed this assessment' });
  const attempt = {
    id: uuidv4(), userId, questionSetId, startTime: new Date().toISOString(),
    endTime: null, status: 'in-progress', answers: {}, score: 0, totalMarks: 0,
    percentage: 0, fitmentCategory: 'pending', trustScore: 0,
    flagged: false, duplicate: false, faceVerified: false, voiceVerified: false, aiAnalysis: null
  };
  db.attempts.push(attempt);
  console.log(`\n[ATTEMPT] Started: User ${userId} on QSet ${questionSetId}`);
  res.json(attempt);
});

app.post('/api/attempts/:id/submit', (req, res) => {
  const attempt = db.attempts.find(a => a.id === req.params.id);
  if (!attempt) return res.status(404).json({ error: 'Not found' });
  const qs = db.questionSets.find(q => q.id === attempt.questionSetId);
  const { answers, faceVerified, voiceVerified, trustScore } = req.body;
  
  // Calculate score
  let score = 0;
  qs.questions.forEach(q => {
    if (answers[q.id] !== undefined && answers[q.id] === q.correct) score += q.marks;
  });
  
  const percentage = (score / qs.totalMarks) * 100;
  const finalTrustScore = trustScore || Math.floor(70 + Math.random() * 30);
  const aiAnalysis = calculateAIScore(answers, qs.questions);
  const fitmentCategory = calculateFitment(percentage, finalTrustScore, faceVerified !== false, voiceVerified !== false, attempt.flagged);

  attempt.answers = answers;
  attempt.score = score;
  attempt.totalMarks = qs.totalMarks;
  attempt.percentage = Math.round(percentage * 10) / 10;
  attempt.endTime = new Date().toISOString();
  attempt.status = 'completed';
  attempt.faceVerified = faceVerified !== false;
  attempt.voiceVerified = voiceVerified !== false;
  attempt.trustScore = finalTrustScore;
  attempt.fitmentCategory = fitmentCategory;
  attempt.aiAnalysis = aiAnalysis;

  console.log(`\n[SUBMIT] Attempt ${req.params.id} completed`);
  console.log(`  Score: ${score}/${qs.totalMarks} (${percentage.toFixed(1)}%)`);
  console.log(`  Trust Score: ${finalTrustScore}`);
  console.log(`  Fitment: ${fitmentCategory}`);
  console.log(`  AI Analysis:`, aiAnalysis);

  res.json(attempt);
});

app.get('/api/attempts/:id/result', (req, res) => {
  const attempt = db.attempts.find(a => a.id === req.params.id);
  if (!attempt) return res.status(404).json({ error: 'Not found' });
  const qs = db.questionSets.find(q => q.id === attempt.questionSetId);
  res.json({ ...attempt, questionSet: qs });
});

// ─── CONSOLE PRINT ROUTE ──────────────────────────────────────────────────────
app.get('/api/admin/console-dump', (req, res) => {
  const summary = {
    timestamp: new Date().toISOString(),
    totalUsers: db.users.length,
    totalCandidates: db.users.filter(u => u.role === 'candidate').length,
    totalAttempts: db.attempts.length,
    completedAttempts: db.attempts.filter(a => a.status === 'completed').length,
    fitmentBreakdown: {
      'job-ready': db.attempts.filter(a => a.fitmentCategory === 'job-ready').length,
      'requires-training': db.attempts.filter(a => a.fitmentCategory === 'requires-training').length,
      'requires-manual-verification': db.attempts.filter(a => a.fitmentCategory === 'requires-manual-verification').length,
      'low-confidence': db.attempts.filter(a => a.fitmentCategory === 'low-confidence').length,
      'fraud-suspected': db.attempts.filter(a => a.fitmentCategory === 'fraud-suspected').length,
    },
    questionSets: db.questionSets.length,
    allAttempts: db.attempts
  };
  console.log('\n═══════════════════ CONSOLE DUMP ═══════════════════');
  console.log(JSON.stringify(summary, null, 2));
  console.log('═════════════════════════════════════════════════════\n');
  res.json(summary);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 EchoHire Backend running on http://localhost:${PORT}`);
  console.log('📊 Admin: admin / admin123');
  console.log('👤 Candidate: ramesh / pass123\n');
});
