import "./firebaseConfig";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();

export const signin = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password).then(
    (userCredential) => {
      const user = userCredential.user;
      console.log(user);
      console.log("signin success");
      return user;
    }
  );
};
