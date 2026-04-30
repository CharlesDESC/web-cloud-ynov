import "./firebaseConfig";
import { getAuth, signInAnonymously } from "firebase/auth";

const auth = getAuth();

export const signinAnonymously = () => {
  return signInAnonymously(auth).then((userCredential) => {
    return userCredential.user;
  });
};
