// frontend/src/services/authService.js
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const idToken = await user.getIdToken();

  return { user, idToken };
}
