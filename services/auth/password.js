import "@/firebaseConfig";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const auth = getAuth();

export const signin = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
    const user = userCredential.user;
    console.log(user);
    console.log("signin success");
    return user;
  });
};

export const signup = (email, password, name) => {
  return createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
    const user = userCredential.user;
    if (name) await updateProfile(user, { displayName: name });
    return user;
  });
};
