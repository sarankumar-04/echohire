export const fitmentConfig = {
  'job-ready': { label: 'Job Ready', badgeClass: 'badge-green', color: '#34d399', icon: '✅' },
  'requires-training': { label: 'Needs Training', badgeClass: 'badge-yellow', color: '#fbbf24', icon: '📚' },
  'requires-manual-verification': { label: 'Manual Review', badgeClass: 'badge-blue', color: '#60a5fa', icon: '🔍' },
  'low-confidence': { label: 'Low Confidence', badgeClass: 'badge-gray', color: '#94a3b8', icon: '⚠️' },
  'fraud-suspected': { label: 'Fraud Suspected', badgeClass: 'badge-red', color: '#f87171', icon: '🚫' },
  'pending': { label: 'Pending', badgeClass: 'badge-cyan', color: '#22d3ee', icon: '⏳' },
};

export const categoryConfig = {
  'blue-collar': { label: 'Blue Collar', icon: '🔧', color: '#f59e0b' },
  'polytechnic': { label: 'Polytechnic', icon: '⚡', color: '#3b82f6' },
  'semi-skilled': { label: 'Semi-Skilled', icon: '🏗️', color: '#8b5cf6' },
};

export const languageConfig = {
  'kn': { label: 'ಕನ್ನಡ', flag: '🇮🇳' },
  'en': { label: 'English', flag: '🇬🇧' },
  'hi': { label: 'हिंदी', flag: '🇮🇳' },
};

export const districtList = ['Bengaluru', 'Mysuru', 'Dharwad', 'Belagavi', 'Mangaluru', 'Tumakuru', 'Shivamogga', 'Ballari', 'Kalaburagi', 'Vijayapura'];

export const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
export const formatDateTime = (d) => d ? new Date(d).toLocaleString('en-IN') : 'N/A';

export const getScoreColor = (pct) => pct >= 75 ? '#34d399' : pct >= 50 ? '#fbbf24' : '#f87171';

export const getFitmentBadge = (cat) => {
  const c = fitmentConfig[cat] || fitmentConfig['pending'];
  return { badgeClass: c.badgeClass, label: c.label, icon: c.icon };
};
