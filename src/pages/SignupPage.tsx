
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SignupPage = () => {
  const { signup, user } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('user');
  const [showAdminWarning, setShowAdminWarning] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [errors, setErrors] = useState<{ 
    name?: string; 
    email?: string; 
    password?: string;
    confirmPassword?: string;
    phone?: string;
    adminCode?: string;
  }>({});

  // The secret admin code - in a real app, this would be handled more securely
  const ADMIN_SECRET_CODE = "admin123"; // This is just for demo purposes

  useEffect(() => {
    if (user) {
      toast.info('You are already logged in');
      if (user.isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/account');
      }
    }
  }, [user, navigate]);

  // Show warning and admin code field when admin role is selected
  useEffect(() => {
    setShowAdminWarning(role === 'admin');
  }, [role]);

  const validateForm = () => {
    const newErrors: { 
      name?: string; 
      email?: string; 
      password?: string;
      confirmPassword?: string;
      phone?: string;
      adminCode?: string;
    } = {};
    let isValid = true;

    if (!name) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (phone && !/^\+?[0-9\s-()]{8,}$/.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    // Validate admin code if admin role is selected
    if (role === 'admin') {
      if (!adminCode) {
        newErrors.adminCode = 'Admin code is required';
        isValid = false;
      } else if (adminCode !== ADMIN_SECRET_CODE) {
        newErrors.adminCode = 'Invalid admin code';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const isAdmin = role === 'admin' && adminCode === ADMIN_SECRET_CODE;
      await signup(email, password, name, phone, gender, isAdmin);
      toast.success('Account created successfully. Please check your email for verification.');
      
      // Redirect based on role
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/account');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light mb-2">Create Account</h1>
          <p className="text-muted-foreground">
            Join us and start shopping our collection.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-destructive text-sm">{errors.email}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
              className={errors.phone ? 'border-destructive' : ''}
            />
            {errors.phone && (
              <p className="text-destructive text-sm">{errors.phone}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gender">Gender (optional)</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Account Type</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Customer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {showAdminWarning && (
            <>
              <Alert variant="destructive" className="bg-yellow-50 border-yellow-500 text-yellow-800">
                <AlertDescription>
                  Warning: Only authorized personnel should create Admin accounts. 
                  Admin accounts have full access to manage products, orders, and user data.
                  Please enter the admin authorization code to continue.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Label htmlFor="adminCode">Admin Authorization Code</Label>
                <Input
                  id="adminCode"
                  type="password"
                  placeholder="Enter admin code"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  disabled={isLoading}
                  className={errors.adminCode ? 'border-destructive' : ''}
                />
                {errors.adminCode && (
                  <p className="text-destructive text-sm">{errors.adminCode}</p>
                )}
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className={errors.password ? 'border-destructive' : ''}
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-destructive text-sm">{errors.password}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className={errors.confirmPassword ? 'border-destructive' : ''}
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-destructive text-sm">{errors.confirmPassword}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
          
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-foreground hover:underline"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default SignupPage;
