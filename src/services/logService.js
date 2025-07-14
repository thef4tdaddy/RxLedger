import { collection, addDoc, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { encryptObject, decryptObject } from './cryptoService.js';

export async function addLogEntry(entry) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  const data = await encryptObject(user.uid, entry);
  await addDoc(collection(db, 'users', user.uid, 'logs'), data);
}

export async function getLogEntries() {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  const snap = await getDocs(collection(db, 'users', user.uid, 'logs'));
  const entries = [];
  for (const d of snap.docs) {
    try {
      const entry = await decryptObject(user.uid, d.data());
      entries.push({ id: d.id, ...entry });
    } catch (err) {
      console.error('Failed to decrypt log entry', err);
    }
  }
  return entries;
}
