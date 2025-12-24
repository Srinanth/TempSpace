const HISTORY_KEY = 'tempspace_created_history';

export const saveToHistory = (data) => {
  try {
    const history = getHistory();
    const newEntry = {
      code: data.space.share_code,
      token: data.token,
      created_at: Date.now()
    };

    const filtered = history.filter(h => h.code !== newEntry.code);
    filtered.unshift(newEntry);

    if (filtered.length > 10) filtered.pop();

    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Failed to save history", e);
  }
};

export const getAdminToken = (code) => {
  const history = getHistory();
  const entry = history.find(h => h.code === code);
  return entry ? entry.token : null;
};

const getHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
};