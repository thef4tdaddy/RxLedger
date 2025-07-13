export async function verifyTurnstile(token) {
  const response = await fetch('/api/verify-turnstile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  if (!response.ok) {
    return { success: false };
  }
  return response.json();
}
