import "./firebaseConfig";
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";

const auth = getAuth();

export const sendPhoneCode = (phoneNumber) => {
  const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "invisible",
  });
  return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
};

export const verifyPhoneCode = (confirmationResult, code) => {
  return confirmationResult.confirm(code).then((result) => {
    console.log("signin with phone success");
    return result.user;
  });
};
