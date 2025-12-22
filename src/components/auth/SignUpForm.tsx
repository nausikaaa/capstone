import { useState } from 'react';
import type { AuthError } from '@supabase/supabase-js';

interface SignUpFormProps {
  onSubmit: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null }>;
}

export function SignUpForm({ onSubmit }: SignUpFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    const { error } = await onSubmit(email, password, fullName || undefined);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setEmail('');
      setPassword('');
      setFullName('');
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Sign Up</h2>

      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message">
          Account created successfully! You can now log in.
        </div>
      )}

      <div className="form-group">
        <label htmlFor="fullName">Full Name (optional)</label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isLoading}
          placeholder="John Doe"
        />
      </div>

      <div className="form-group">
        <label htmlFor="signup-email">Email</label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          placeholder="your@email.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="signup-password">Password</label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          placeholder="••••••••"
          minLength={6}
        />
        <small className="form-hint">Minimum 6 characters</small>
      </div>

      <button type="submit" disabled={isLoading} className="auth-button">
        {isLoading ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>
  );
}
