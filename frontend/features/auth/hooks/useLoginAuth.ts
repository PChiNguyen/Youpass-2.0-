'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { loginWithEmail, loginWithGoogle } from '../api';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (
            parent: HTMLElement,
            options: Record<string, unknown>
          ) => void;
        };
      };
    };
  }
}

export function useLoginAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gsiLoaded, setGsiLoaded] = useState(false);

  const googleBtnContainerRef = useRef<HTMLDivElement>(null);
  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  const handleGoogleCredentialResponse = useCallback(
    async (response: { credential?: string }) => {
      if (!response.credential) {
        setError('Google login failed: No credential received from Google.');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const data = await loginWithGoogle(response.credential);
        setToken(data.access_token);
        router.push('/');
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : 'Google authentication server error.'
        );
      } finally {
        setLoading(false);
      }
    },
    [router, setToken]
  );

  useEffect(() => {
    if (!gsiLoaded || !window.google?.accounts?.id || !googleClientId) {
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredentialResponse,
        ux_mode: 'popup',
        auto_select: false,
      });

      if (googleBtnContainerRef.current) {
        googleBtnContainerRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
          type: 'standard',
          theme: 'filled_black',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 210,
        });
      }
    } catch (err) {
      console.error('Failed to render Google Sign-In button:', err);
    }
  }, [gsiLoaded, googleClientId, handleGoogleCredentialResponse]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginWithEmail(email, password);
      setToken(data.access_token);
      router.push('/');
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred during sign in.'
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    loading,
    error,
    setError,
    setGsiLoaded,
    googleBtnContainerRef,
    googleClientId,
    handleLogin,
  };
}