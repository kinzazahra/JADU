import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="glass p-8 rounded-2xl w-full max-w-md flex flex-col items-center space-y-6">
        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
          <BrainCircuit className="h-8 w-8 text-primary" />
        </div>
        
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Access VayuSync</h1>
          <p className="text-sm text-muted-foreground">Sign in to sync your devices</p>
        </div>

        {error && <div className="w-full p-3 text-sm text-destructive bg-destructive/10 rounded-md">{error}</div>}

        <form onSubmit={handleEmailLogin} className="w-full space-y-4">
          <div className="space-y-2">
            <Input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background/50"
            />
            <Input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-background/50"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Login'}
          </Button>
        </form>

        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground glass rounded-md">Or continue with</span>
          </div>
        </div>

        <Button variant="outline" type="button" className="w-full bg-background/50" onClick={handleGoogleLogin}>
          <Mail className="mr-2 h-4 w-4" /> Google Sign-In
        </Button>
      </div>
    </div>
  );
}