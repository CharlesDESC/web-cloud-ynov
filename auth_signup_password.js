import "./firebaseConfig";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const auth = getAuth();

export const signup = (email, password, name) => {
  return createUserWithEmailAndPassword(auth, email, password).then(
    async (userCredential) => {
      const user = userCredential.user;
      if (name) await updateProfile(user, { displayName: name });
      return user;
    }
  );
};
