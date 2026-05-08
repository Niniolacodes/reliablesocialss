import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, db, googleProvider } from "./firebase-config.js";

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

async function setRememberMe(enabled) {
  await setPersistence(auth, enabled ? browserLocalPersistence : browserSessionPersistence);
}

async function loginWithEmail(email, password, rememberMe = true) {
  await setRememberMe(rememberMe);
  const result = await signInWithEmailAndPassword(auth, email, password);
  const user = result.user;
  cacheUser({ uid: user.uid, email: user.email || email });
  return user;
}

async function registerWithEmail(payload) {
  const {
    email,
    password,
    firstName = "",
    lastName = "",
    phone = "",
  } = payload;

  const result = await createUserWithEmailAndPassword(auth, email, password);
  const user = result.user;

  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      email,
      firstName,
      lastName,
      phone,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  cacheUser({ uid: user.uid, email, firstName, lastName, phone });
  return user;
}

async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(
      userRef,
      {
        uid: user.uid,
        email: user.email || "",
        firstName: user.displayName ? user.displayName.split(" ")[0] : "",
        lastName: user.displayName ? user.displayName.split(" ").slice(1).join(" ") : "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  cacheUser({ uid: user.uid, email: user.email || "" });
  return user;
}

function requireAuth(redirectTo = "login.html") {
  if (localStorage.getItem(AUTH_KEY) !== "1") {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = redirectTo;
      } else {
        cacheUser({ uid: user.uid, email: user.email || "" });
      }
    });
  }
}

async function logout(redirectTo = "login.html") {
  try {
    await signOut(auth);
  } finally {
    clearCache();
    window.location.href = redirectTo;
  }
}

function bindLogout(selector = "[data-logout]", redirectTo = "login.html") {
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener("click", async (e) => {
      e.preventDefault();
      await logout(redirectTo);
    });
  });
}

export const ReliableAuth = {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  requireAuth,
  logout,
  bindLogout,
};

window.ReliableAuth = ReliableAuth;

