const AUTH_KEY = "rs_auth";
const USER_KEY = "rs_user";

function authConfig() {
  return window.ReliableAuthConfig || {};
}

function sessionPayload() {
  return window.ReliableSession || { authenticated: false, user: null };
}

function cacheUser(userData) {
  localStorage.setItem(AUTH_KEY, "1");
  localStorage.setItem(USER_KEY, JSON.stringify(userData || {}));
}

function clearCache() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(USER_KEY);
}

function rememberServerUser() {
  const session = sessionPayload();
  if (session.authenticated && session.user) {
    cacheUser(session.user);
    return session.user;
  }

  return null;
}

async function authRequest(action, payload = {}) {
  const config = authConfig();
  const response = await fetch(config.apiUrl || "auth-api.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": config.csrfToken || "",
    },
    body: JSON.stringify({
      action,
      csrf_token: config.csrfToken || "",
      ...payload,
    }),
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || "Unable to complete request.");
  }

  if (data.csrfToken) {
    window.ReliableAuthConfig = {
      ...config,
      csrfToken: data.csrfToken,
    };
  }

  if (data.user) {
    window.ReliableSession = {
      authenticated: true,
      user: data.user,
    };
    cacheUser(data.user);
  }

  return data;
}

async function loginWithEmail(email, password, remember = false) {
  const data = await authRequest("login", { email, password, remember });
  return data.user;
}

async function registerWithEmail(payload) {
  const data = await authRequest("register", payload);
  return data.user;
}

async function loginWithGoogle() {
  const data = await authRequest("google");
  return data.user;
}

function requireAuth(redirectTo = "login.php") {
  if (rememberServerUser()) {
    return true;
  }

  clearCache();
  window.location.href = redirectTo;
  return false;
}

async function logout(redirectTo = "login.php") {
  try {
    await authRequest("logout");
  } catch {
    clearCache();
    window.location.href = "logout.php";
    return;
  }

  clearCache();
  window.location.href = redirectTo;
}

function bindLogout(selector = "[data-logout]", redirectTo = "login.php") {
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener("click", async (e) => {
      e.preventDefault();
      await logout(redirectTo);
    });
  });
}

rememberServerUser();

window.ReliableAuth = {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  requireAuth,
  logout,
  bindLogout,
};
