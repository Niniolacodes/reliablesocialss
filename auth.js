const AUTH_KEY = "rs_auth";
const USER_KEY = "rs_user";
const USERS_KEY = "rs_users";

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function cacheUser(userData) {
  localStorage.setItem(AUTH_KEY, "1");
  localStorage.setItem(USER_KEY, JSON.stringify(userData || {}));
}

function clearCache() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(USER_KEY);
}

async function loginWithEmail(email, password) {
  const users = readUsers();
  const key = (email || "").trim().toLowerCase();
  const entry = users[key];
  if (!entry || entry.password !== password) {
    throw new Error("Invalid email or password.");
  }
  const user = {
    uid: entry.uid,
    email: entry.email,
    firstName: entry.firstName || "",
    lastName: entry.lastName || "",
    phone: entry.phone || "",
  };
  cacheUser(user);
  return user;
}

async function registerWithEmail(payload) {
  const email = (payload?.email || "").trim();
  const password = payload?.password || "";
  const firstName = payload?.firstName || "";
  const lastName = payload?.lastName || "";
  const phone = payload?.phone || "";

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const users = readUsers();
  const key = email.toLowerCase();
  if (users[key]) {
    throw new Error("Account already exists for this email.");
  }

  const user = {
    uid: `local_${Date.now()}`,
    email,
    firstName,
    lastName,
    phone,
    password,
    createdAt: new Date().toISOString(),
  };

  users[key] = user;
  writeUsers(users);
  cacheUser({ uid: user.uid, email, firstName, lastName, phone });
  return user;
}

async function loginWithGoogle() {
  const user = {
    uid: `local_google_${Date.now()}`,
    email: "google-user@reliablesocials.local",
    firstName: "Google",
    lastName: "User",
  };
  cacheUser(user);
  return user;
}

function requireAuth(redirectTo = "login.php") {
  if (localStorage.getItem(AUTH_KEY) !== "1") {
    window.location.href = redirectTo;
  }
}

async function logout(redirectTo = "login.php") {
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

window.ReliableAuth = {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  requireAuth,
  logout,
  bindLogout,
};

