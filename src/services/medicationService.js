import { collection, addDoc, getDocs, setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { encryptObject, decryptObject } from './cryptoService.js';

export async function addMedication(medication) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  const data = await encryptObject(user.uid, medication);
  await addDoc(collection(db, 'users', user.uid, 'medications'), data);
}

export async function getMedications() {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  const snap = await getDocs(collection(db, 'users', user.uid, 'medications'));
  const meds = [];
  for (const d of snap.docs) {
    try {
      const med = await decryptObject(user.uid, d.data());
      meds.push({ id: d.id, ...med });
    } catch (err) {
      console.error('Failed to decrypt medication', err);
    }
  }
  return meds;
}

export async function updateUserInfo(user) {
  await setDoc(
    doc(db, 'users', user.uid),
    {
      email: user.email || '',
      displayName: user.displayName || '',
      lastLogin: user.metadata?.lastSignInTime || new Date().toISOString(),
    },
    { merge: true },
  );
}
