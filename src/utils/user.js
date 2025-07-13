import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export async function createUserProfile(uid, { name, age, email }) {
  await setDoc(doc(collection(db, 'users'), uid), {
    name,
    age,
    email,
  });
}
