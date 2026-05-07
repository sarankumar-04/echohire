const API_BASE = "https://echohire-api-elsk.onrender.com";

const api = async (path, opts = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Request failed'); }
  return res.json();
};

export const authAPI = {
  login: (data) => api('/auth/login', { method: 'POST', body: data }),
  register: (data) => api('/auth/register', { method: 'POST', body: data }),
};

export const adminAPI = {
  getStats: () => api('/admin/stats'),
  getCandidates: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api(`/admin/candidates${q ? '?' + q : ''}`);
  },
  getAttempts: () => api('/admin/attempts'),
  getAttemptDetail: (id) => api(`/admin/attempts/${id}`),
  flagAttempt: (id) => api(`/admin/attempts/${id}/flag`, { method: 'PATCH' }),
  consoleDump: () => api('/admin/console-dump'),
};

export const qsAPI = {
  getAll: () => api('/questionsets'),
  getOne: (id) => api(`/questionsets/${id}`),
  create: (data) => api('/questionsets', { method: 'POST', body: data }),
  update: (id, data) => api(`/questionsets/${id}`, { method: 'PUT', body: data }),
  delete: (id) => api(`/questionsets/${id}`, { method: 'DELETE' }),
  assign: (id, userIds) => api(`/questionsets/${id}/assign`, { method: 'POST', body: { userIds } }),
};

export const candidateAPI = {
  getAssigned: (userId) => api(`/candidate/${userId}/assigned`),
  startAttempt: (data) => api('/attempts/start', { method: 'POST', body: data }),
  submitAttempt: (id, data) => api(`/attempts/${id}/submit`, { method: 'POST', body: data }),
  getResult: (id) => api(`/attempts/${id}/result`),
};

export default api;
