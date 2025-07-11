import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="max-w-sm mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Login to RxLedger</h1>
      <LoginForm />
      <p className="mt-4 text-center text-sm">
        Don’t have an account?{' '}
        <a href="/register" className="text-blue-600 underline">
          Create one
        </a>
      </p>
    </div>
  );
}
