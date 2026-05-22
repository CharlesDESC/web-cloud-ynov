import "@/firebaseConfig";
import { getAuth, signInWithPopup, GithubAuthProvider } from "firebase/auth";

const auth = getAuth();
const provider = new GithubAuthProvider();

export const signinWithGithub = () => {
  return signInWithPopup(auth, provider).then((result) => {
    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    console.log("signin success with github");
    return user;
  });
};
