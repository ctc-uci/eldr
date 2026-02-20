import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithRedirect,
} from "firebase/auth";

import { auth } from "./firebase";

const facebookProvider = new FacebookAuthProvider();
const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider("microsoft.com");

/**
 * `signInWithRedirect` is patched!
 *
 * @see {@link client/docs/signInWithRedirect.md} for more detailed documentation.
 */
const patchedSignInWithRedirect = signInWithRedirect;

export async function authenticateFacebookUser() {
  await patchedSignInWithRedirect(auth, facebookProvider);
}

export async function authenticateGoogleUser() {
  await patchedSignInWithRedirect(auth, googleProvider);
}

export async function authenticateMicrosoftUser() {
  await patchedSignInWithRedirect(auth, microsoftProvider);
}