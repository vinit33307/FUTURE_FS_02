import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8 overflow-hidden relative">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-10">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md animate-scale-in">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-4 shadow-lg shadow-primary/20">
            <Layout className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">LeadFlow CRM</h1>
          <p className="text-muted-foreground mt-2">Enterprise Client Intelligence System</p>
        </div>

        <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your email to access your sales workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50"
                  required 
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50"
                  required 
                />
              </div>
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium animate-shake">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In to Workspace'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4">
                Register company
              </Link>
            </p>
          </CardFooter>
        </Card>
        
        <p className="text-center text-xs text-muted-foreground mt-8">
          By signing in, you agree to our <Link to="#" className="underline">Terms of Service</Link> and <Link to="#" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
