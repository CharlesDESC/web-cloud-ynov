import "./firebaseConfig";
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";

const auth = getAuth();
let recaptchaVerifier = null;

const getRecaptchaVerifier = () => {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      "expired-callback": () => {
        recaptchaVerifier = null;
      },
    });
  }
  return recaptchaVerifier;
};

export const sendPhoneCode = async (phoneNumber) => {
  try {
    const verifier = getRecaptchaVerifier();
    return await signInWithPhoneNumber(auth, phoneNumber, verifier);
  } catch (error) {
    recaptchaVerifier = null;
    throw error;
  }
};

export const verifyPhoneCode = (confirmationResult, code) => {
  return confirmationResult.confirm(code).then((result) => {
    return result.user;
  });
};
