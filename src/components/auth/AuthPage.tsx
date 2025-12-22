import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import './AuthPage.css';

export function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const { signIn, signUp } = useAuth();

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Property Tracker</h1>
          <p>Track and manage your property viewings</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Log In
          </button>
          <button
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        <div className="auth-content">
          {activeTab === 'login' ? (
            <LoginForm onSubmit={signIn} />
          ) : (
            <SignUpForm onSubmit={signUp} />
          )}
        </div>
      </div>
    </div>
  );
}
