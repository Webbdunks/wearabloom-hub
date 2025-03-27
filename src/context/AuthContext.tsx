
import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type UserAddress = {
  id: string;
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
  type: 'shipping' | 'billing';
};

type User = {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  profilePicture?: string;
  addresses: UserAddress[];
} | null;

type AuthContextType = {
  user: User;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (userData: Partial<Omit<NonNullable<User>, 'id' | 'email' | 'addresses'>>) => void;
  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Omit<UserAddress, 'id'>>) => void;
  removeAddress: (id: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        
        if (session?.user) {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (profileError) throw profileError;
            
            const addresses: UserAddress[] = [];
            
            const userData: User = {
              id: session.user.id,
              email: profileData?.email || session.user.email!,
              name: profileData?.full_name || session.user.user_metadata?.full_name,
              profilePicture: profileData?.avatar_url,
              addresses: addresses
            };
            
            setUser(userData);
          } catch (error) {
            console.error("Error fetching user data:", error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast.success('Successfully logged in');
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.message || 'Invalid email or password. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();
        
      if (existingUser) {
        throw new Error('A user with this email already exists');
      }
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name || email.split('@')[0],
          },
        }
      });
      
      if (error) throw error;
      
      toast.success('Account created successfully. Please check your email for verification.');
    } catch (error: any) {
      console.error("Signup failed:", error);
      toast.error(error.message || 'Signup failed. Please try again later.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.success('Successfully logged out');
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error('Logout failed. Please try again.');
    }
  };

  const updateUserProfile = async (userData: Partial<Omit<NonNullable<User>, 'id' | 'email' | 'addresses'>>) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: userData.name,
            avatar_url: userData.profilePicture,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
          
        if (error) throw error;
        
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        toast.success('Profile updated successfully');
      } catch (error) {
        console.error("Profile update failed:", error);
        toast.error('Failed to update profile. Please try again.');
      }
    }
  };

  const addAddress = (address: Omit<UserAddress, 'id'>) => {
    if (user) {
      const newAddress = { ...address, id: crypto.randomUUID() };
      
      const updatedAddresses = [...user.addresses];
      
      if (newAddress.isDefault) {
        updatedAddresses.forEach(addr => {
          if (addr.type === newAddress.type) {
            addr.isDefault = false;
          }
        });
      }
      
      if (!updatedAddresses.some(addr => addr.type === newAddress.type)) {
        newAddress.isDefault = true;
      }
      
      updatedAddresses.push(newAddress);
      
      const updatedUser = { ...user, addresses: updatedAddresses };
      setUser(updatedUser);
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const updateAddress = (id: string, addressUpdate: Partial<Omit<UserAddress, 'id'>>) => {
    if (user) {
      const updatedAddresses = [...user.addresses];
      const index = updatedAddresses.findIndex(addr => addr.id === id);
      
      if (index !== -1) {
        const updatedAddress = { ...updatedAddresses[index], ...addressUpdate };
        updatedAddresses[index] = updatedAddress;
        
        if (addressUpdate.isDefault) {
          updatedAddresses.forEach((addr, i) => {
            if (i !== index && addr.type === updatedAddress.type) {
              addr.isDefault = false;
            }
          });
        }
        
        const updatedUser = { ...user, addresses: updatedAddresses };
        setUser(updatedUser);
        
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    }
  };

  const removeAddress = (id: string) => {
    if (user) {
      const filteredAddresses = user.addresses.filter(addr => addr.id !== id);
      const updatedUser = { ...user, addresses: filteredAddresses };
      setUser(updatedUser);
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      signup, 
      logout,
      updateUserProfile,
      addAddress,
      updateAddress,
      removeAddress
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
