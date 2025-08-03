'use client';

import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import GoogleButton from './GoogleButton';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login,isAuthenticated } = useAuth();
  const router = useRouter();


  useEffect(() => {
    console.log('Login form - isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      console.log('Redirecting to dashboard...');
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Submitting login form...');
      await login(email, password);
      console.log('Login completed successfully');
      // Don't manually redirect here, let the useEffect handle it
    } catch (error) {
      console.error('Login form error:', error);
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async () => {
    try {
      // TODO: Implement Google login
      console.log('Google login not implemented yet');
      toast.error('Google login not implemented yet');
    } catch {
      toast.error('Google login failed');
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div className="mt-6">
          <GoogleButton onSuccess={handleGoogleSuccess} />
        </div>
      </div>
    </div>
  );
}