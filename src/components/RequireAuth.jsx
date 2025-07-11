import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';

export default function RequireAuth({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  // If using email/password, enforce email verification
  const isEmailProvider = user.providerData[0]?.providerId === 'password';
  if (isEmailProvider && !user.emailVerified) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <h2 className="text-lg font-semibold mb-2">Verify Your Email</h2>
        <p className="mb-4">
          Please check your inbox and click the verification link before using
          RxLedger.
        </p>
        <button
          onClick={async () => {
            await user.sendEmailVerification();
            alert('Verification email resent!');
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Resend Verification Email
        </button>
      </div>
    );
  }

  return children;
}
