import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase.js';

/** Register a new user with email/password and set their display name. */
export async function register(name, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  return cred.user;
}

/** Sign in an existing user. */
export async function login(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

/** Sign out the current user. */
export async function logout() {
  await signOut(auth);
}

/** Returns the current Firebase ID token (refreshed automatically). */
export async function getToken() {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return user.getIdToken();
}

/** Subscribe to auth state changes. Returns unsubscribe fn. */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

/** Get the currently signed-in user (or null). */
export function currentUser() {
  return auth.currentUser;
}
