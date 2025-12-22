import { useState } from 'react';
import type { AuthError } from '@supabase/supabase-js';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<{ error: AuthError | null }>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { error } = await onSubmit(email, password);

    if (error) {
      setError(error.message);
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Log In</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          placeholder="your@email.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          placeholder="••••••••"
          minLength={6}
        />
      </div>

      <button type="submit" disabled={isLoading} className="auth-button">
        {isLoading ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  );
}
