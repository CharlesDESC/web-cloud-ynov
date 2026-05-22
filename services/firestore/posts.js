import "@/firebaseConfig";
import { getFirestore, collection, addDoc, getDocs, orderBy, query } from "firebase/firestore";

const db = getFirestore();

export const createPost = async (title, text, createdBy) => {
  const docRef = await addDoc(collection(db, "posts"), {
    title,
    text,
    createdBy,
    date: new Date(),
  });
  return docRef.id;
};

export const getPosts = async () => {
  const q = query(collection(db, "posts"), orderBy("date", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
