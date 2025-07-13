export async function getUserKey(uid) {
  let stored = localStorage.getItem(`key-${uid}`);
  if (!stored) {
    const raw = crypto.getRandomValues(new Uint8Array(32));
    stored = btoa(String.fromCharCode(...raw));
    localStorage.setItem(`key-${uid}`, stored);
  }
  const raw = Uint8Array.from(atob(stored), c => c.charCodeAt(0));
  return crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

export async function encryptObject(uid, data) {
  const key = await getUserKey(uid);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(data));
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  return {
    iv: btoa(String.fromCharCode(...iv)),
    data: btoa(String.fromCharCode(...new Uint8Array(cipher)))
  };
}

export async function decryptObject(uid, encrypted) {
  const key = await getUserKey(uid);
  const iv = Uint8Array.from(atob(encrypted.iv), c => c.charCodeAt(0));
  const cipher = Uint8Array.from(atob(encrypted.data), c => c.charCodeAt(0));
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
  return JSON.parse(new TextDecoder().decode(plain));
}
