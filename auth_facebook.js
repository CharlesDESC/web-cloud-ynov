import "./firebaseConfig";
import { getAuth, signInWithPopup, FacebookAuthProvider } from "firebase/auth";

const auth = getAuth();
const provider = new FacebookAuthProvider();

export const signinWithFacebook = () => {
  return signInWithPopup(auth, provider).then((result) => {
    const user = result.user;
    return user;
  });
};
