(function () {
  const AUTH_KEY = "rs_auth";
  const USER_KEY = "rs_user";

  function setUser(payload) {
    localStorage.setItem(AUTH_KEY, "1");
    localStorage.setItem(USER_KEY, JSON.stringify(payload || {}));
  }

  function isAuthed() {
    return localStorage.getItem(AUTH_KEY) === "1";
  }

  function requireAuth(redirectTo) {
    if (!isAuthed()) {
      window.location.href = redirectTo || "login.html";
    }
  }

  function logout(redirectTo) {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = redirectTo || "login.html";
  }

  function bindLogout(selector, redirectTo) {
    document.querySelectorAll(selector || "[data-logout]").forEach((el) => {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        logout(redirectTo);
      });
    });
  }

  window.ReliableAuth = {
    setUser,
    isAuthed,
    requireAuth,
    logout,
    bindLogout,
  };
})();

