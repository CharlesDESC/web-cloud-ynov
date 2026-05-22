import "@/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";

export const uploadProfilePhoto = async (uri) => {
  const fetchResponse = await fetch(uri);
  const theBlob = await fetchResponse.blob();

  const auth = getAuth();
  const userId = auth.currentUser.uid;
  const imageRef = ref(getStorage(), `profile-photos/${userId}`);

  const snapshot = await uploadBytes(imageRef, theBlob);
  const downloadUrl = await getDownloadURL(snapshot.ref);

  await updateProfile(auth.currentUser, { photoURL: downloadUrl });

  return downloadUrl;
};
