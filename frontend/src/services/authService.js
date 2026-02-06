import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./firebase";

/**
 * Opens Google login popup and returns:
 * - firebaseUser
 * - idToken (Firebase ID token)
 */
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();

  // Optional: forces account chooser every time
  provider.setCustomParameters({ prompt: "select_account" });

  const result = await signInWithPopup(auth, provider);
  const firebaseUser = result.user;

  const idToken = await firebaseUser.getIdToken();

  return { firebaseUser, idToken };
}

export async function logout() {
  await signOut(auth);
}
