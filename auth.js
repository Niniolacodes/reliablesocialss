const AUTH_KEY = "rs_auth";
const USER_KEY = "rs_user";

function cacheUser(userData) {
  localStorage.setItem(AUTH_KEY, "1");
  localStorage.setItem(USER_KEY, JSON.stringify(userData || {}));
}

function clearCache() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(USER_KEY);
}

async function loginWithEmail(email, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Username or password is wrong.');
  }
  const user = data.user || {};
  cacheUser(user);
  return user;
}

async function registerWithEmail(payload) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Unable to create account right now.');
  }
  const user = data.user || {};
  cacheUser(user);
  return user;
}

async function loginWithGoogle() {
  const user = {
    id: `local_google_${Date.now()}`,
    email: 'google-user@reliablesocials.local',
    firstName: 'Google',
    lastName: 'User',
  };
  cacheUser(user);
  return user;
}

function requireAuth(redirectTo = 'login.html') {
  if (localStorage.getItem(AUTH_KEY) !== '1') {
    window.location.href = redirectTo;
  }
}

async function logout(redirectTo = 'login.html') {
  clearCache();
  window.location.href = redirectTo;
}

function bindLogout(selector = '[data-logout]', redirectTo = 'login.html') {
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener('click', async (e) => {
      e.preventDefault();
      await logout(redirectTo);
    });
  });
}

window.ReliableAuth = {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  requireAuth,
  logout,
  bindLogout,
};

