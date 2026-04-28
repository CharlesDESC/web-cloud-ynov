import "./firebaseConfig";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();

export const signup = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password).then(
    (userCredential) => {
      const user = userCredential.user;
      console.log(user);
      console.log("signup success");
      return user;
    }
  );
};
