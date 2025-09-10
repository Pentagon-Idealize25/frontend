'use client';

import { useEffect } from 'react';
// import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential?: string }) => void }) => void;
          renderButton: (element: HTMLElement | null, options: { theme: string; size: string; text: string }) => void;
        };
      };
    };
  }
}

export default function GoogleButton({ onSuccess }: { onSuccess: (token: string) => void }) {
  useEffect(() => {
    const handleGoogleResponse = (response: { credential?: string }) => {
      if (response.credential) {
        onSuccess(response.credential);
      } else {
        toast.error('Google login failed');
      }
    };

    const initializeGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
          callback: handleGoogleResponse,
        });
        
        window.google.accounts.id.renderButton(
          document.getElementById('googleSignIn'),
          { theme: 'outline', size: 'large', text: 'signin_with' }
        );
      }
    };

    // Load Google SDK
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = initializeGoogle;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [onSuccess]);

  return (
    <div id="googleSignIn" className="w-full"></div>
  );
}