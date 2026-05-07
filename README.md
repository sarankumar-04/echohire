# EchoHire: Authentic Signal Assessment
### AI SkillFit: Video Assessment for Workforce Fitment
**Karnataka EDCS | AI for Bharat Hackathon | Theme 5**

---

## 🚀 What is EchoHire?

EchoHire is a full-stack, AI-powered workforce assessment platform built for the Government of Karnataka. It enables scalable, multilingual (Kannada/Hindi/English) candidate screening with:

- **MCQ-based AI Assessments** with intelligent scoring
- **TrustMesh Verification** — face + voice authenticity simulation
- **AI Fitment Classification** — 5-tier workforce categorization
- **Admin Dashboard** — district-level workforce intelligence
- **Dynamic Question Management** — admin creates & assigns MCQs to specific users
- **Console Logging** — all AI scores, trust signals, fitment decisions logged in real-time

---

## 🏗️ Project Structure

```
echohire/
├── backend/          → Node.js + Express REST API (Port 5000)
│   ├── server.js     → Full API + AI Scoring Engine + In-memory DB
│   └── package.json
└── frontend/         → React.js (Port 3000)
    ├── public/
    └── src/
        ├── App.js                    → Routes + Auth guard
        ├── App.css                   → Full design system (dark navy theme)
        ├── context/AuthContext.js    → JWT auth context
        ├── utils/api.js              → Axios API helpers
        ├── utils/helpers.js          → Fitment config, formatters
        ├── components/FitmentBadge.js
        └── pages/
            ├── AuthPage.js           → Login / Register
            ├── AdminDashboard.js     → Stats, charts, workforce heatmap
            ├── QuestionManager.js    → Create MCQs, assign to users
            ├── CandidatesPage.js     → Candidate list with filters
            ├── AttemptsPage.js       → Assessment results + flag/unflag
            └── CandidateDashboard.js → Candidate portal + assessment flow
```

---

## ⚡ Instructions to Run

### Prerequisites
- Node.js v16+ (https://nodejs.org)
- npm v8+

### Step 1: Start the Backend

```bash
cd echohire/backend
npm install
node server.js
```

> Backend runs at **http://localhost:5000**
> Watch the terminal — all AI scoring, trust verification, and fitment decisions are logged here in real-time.

### Step 2: Start the Frontend

```bash
# Open a NEW terminal
cd echohire/frontend
npm install
npm start
```

> Frontend runs at **http://localhost:3000**

### Step 3: Login and Explore

**Admin Account:**
| Field    | Value     |
|----------|-----------|
| Username | `admin`   |
| Password | `admin123`|

**Demo Candidate Accounts:**
| Username  | Password  | Language | Category      | District   |
|-----------|-----------|----------|---------------|------------|
| `ramesh`  | `pass123` | Kannada  | Blue-collar   | Mysuru     |
| `priya`   | `pass123` | English  | Polytechnic   | Dharwad    |
| `suresh`  | `pass123` | Hindi    | Semi-skilled  | Belagavi   |
| `kavitha` | `pass123` | Kannada  | Blue-collar   | Mangaluru  |
| `arjun`   | `pass123` | English  | Polytechnic   | Tumakuru   |

---

## 🎯 How to Demo the Full Flow

### Admin Flow:
1. Login as `admin`
2. Go to **Question Manager** → Create a new MCQ set
3. Assign the question set to a specific candidate (e.g., `ramesh`)
4. Go to **Dashboard** → Click **"Console Dump"** to see full DB state in terminal
5. Go to **Candidates** → Filter by district, language, fitment
6. Go to **Results** → View AI scores, flag/unflag suspicious attempts

### Candidate Flow:
1. Login as `ramesh` (or any candidate)
2. See assigned assessments on dashboard
3. Click **"Start Assessment"** → TrustMesh verification flow begins
4. Face + Voice verification simulated with trust score
5. Complete the MCQ assessment with live timer
6. See **AI Fitment Result** with detailed scoring breakdown

---

## 🤖 AI Scoring Engine

The backend `server.js` contains a full AI scoring engine:

### Trust Score Calculation
```
TrustScore = 0.4×faceScore + 0.35×voiceScore + 0.25×behaviorScore
```

### AI Assessment Scoring
- **Relevance Score** — Based on correct answer percentage
- **Communication Score** — Derived from response time patterns
- **Confidence Score** — Combined trust + performance signal
- **Overall AI Score** — Weighted ensemble of all signals

### Fitment Classification
| Score | Trust | Fitment Category |
|-------|-------|-----------------|
| ≥70% | ≥75 | ✅ Job-Ready |
| 50-70% | ≥60 | 📚 Requires Training |
| Any | <50 | 🔍 Requires Manual Verification |
| <50% | Any | ⚠️ Low Confidence |
| Flagged | Suspicious | 🚨 Fraud Suspected |

---

## 📊 Console Logging

All key events are logged to the backend terminal with prefixed labels:

```
[AUTH]        Login/logout events with user details
[REGISTER]    New candidate registrations
[QUESTIONSET] Question set creation, updates, assignments
[ASSIGN]      When admin assigns a test to a user
[ATTEMPT]     When a candidate starts an assessment
[SUBMIT]      Full AI scoring dump when assessment is submitted
[CONSOLE-DUMP] Full database state snapshot
```

To trigger a full console dump at any time:
- As Admin → Dashboard → Click **"Console Dump"** button
- Or call: `GET http://localhost:5000/api/admin/console-dump`

---

## 🌐 Multilingual Support

| Language | Code | Sample Questions |
|----------|------|-----------------|
| Kannada  | `kn` | ನಿಮ್ಮ ವೃತ್ತಿ ಅನುಭವದ ಬಗ್ಗೆ ತಿಳಿಸಿ |
| English  | `en` | Tell us about your work experience |
| Hindi    | `hi` | अपने कार्य अनुभव के बारे में बताएं |

Questions display bilingual text (Kannada + English) for accessibility.

---

## 🏛️ Karnataka Districts Covered

Bengaluru, Mysuru, Dharwad, Belagavi, Mangaluru, Tumakuru, Davangere, Shivamogga, Hubballi, Kalaburagi

---

## 🔧 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login (admin/candidate) |
| POST | `/api/auth/register` | Register new candidate |
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/candidates` | All candidates list |
| GET | `/api/admin/attempts` | All assessment attempts |
| PATCH | `/api/admin/attempts/:id/flag` | Flag suspicious attempt |
| GET | `/api/admin/console-dump` | Full DB + AI state dump |
| GET | `/api/questionsets` | All question sets |
| POST | `/api/questionsets` | Create new question set |
| POST | `/api/questionsets/:id/assign` | Assign to user |
| POST | `/api/attempts/start` | Start assessment |
| POST | `/api/attempts/:id/submit` | Submit + get AI score |
| GET | `/api/attempts/:id/result` | Get result details |

---

## 📦 Tech Stack

**Backend:** Node.js, Express.js, Morgan, UUID, JWT, bcryptjs
**Frontend:** React.js, React Router v6, Recharts, Lucide React, Axios
**AI Engine:** Custom scoring algorithms (pure JS, no external ML dependency)
**Fonts:** Syne (headings), DM Sans (body) via Google Fonts

---

## 🎨 Design System

- **Theme:** Dark navy (`#0a0e1a`) with blue (`#3b82f6`) + cyan (`#06b6d4`) accents
- **Mobile-first** responsive layout
- **Accessibility:** High contrast, bilingual labels, large touch targets

---

## 📋 Submission Details

- **Title:** EchoHire: Authentic Signal Assessment
- **Theme:** Theme 5 — AI SkillFit: Video Assessment for Workforce Fitment
- **Parent Submission:** EchoHire: Authentic Signal Assessment (Idea Phase)
- **Organization:** Karnataka EDCS
- **Hackathon:** AI for Bharat

---

*Built for Karnataka's workforce. Powered by AI. Trusted by design.*
