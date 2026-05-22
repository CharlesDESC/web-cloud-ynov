import "@/firebaseConfig";
import { getFirestore, collection, addDoc, getDocs, orderBy, query } from "firebase/firestore";

const db = getFirestore();

export const addComment = async (postId, text, authorName, authorId) => {
  const docRef = await addDoc(collection(db, "posts", postId, "comments"), {
    text,
    authorName,
    authorId,
    date: new Date(),
  });
  return docRef.id;
};

export const getComments = async (postId) => {
  const q = query(
    collection(db, "posts", postId, "comments"),
    orderBy("date", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
