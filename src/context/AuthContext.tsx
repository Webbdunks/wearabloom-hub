
import React, { createContext, useState, useContext, useEffect } from "react";

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
  updateUserProfile: (userData: Partial<Omit<User, 'id' | 'email' | 'addresses'>>) => void;
  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Omit<UserAddress, 'id'>>) => void;
  removeAddress: (id: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for user data
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, let's check if email contains "@" and password length >= 6
      if (!email.includes('@') || password.length < 6) {
        throw new Error("Invalid credentials");
      }
      
      // Mock successful login
      const mockAddresses = [
        {
          id: crypto.randomUUID(),
          fullName: "John Doe",
          streetAddress: "123 Main St",
          city: "Mumbai",
          state: "Maharashtra",
          postalCode: "400001",
          country: "India",
          phone: "+91 9876543210",
          isDefault: true,
          type: 'shipping' as const
        }
      ];
      
      const newUser = { 
        id: crypto.randomUUID(), 
        email,
        name: email.split('@')[0],
        phone: "+91 9876543210",
        addresses: mockAddresses
      };
      
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful signup
      const newUser = { 
        id: crypto.randomUUID(), 
        email,
        name,
        addresses: []
      };
      
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } catch (error) {
      console.error("Signup failed:", error);
      throw new Error("Signup failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateUserProfile = (userData: Partial<Omit<User, 'id' | 'email' | 'addresses'>>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const addAddress = (address: Omit<UserAddress, 'id'>) => {
    if (user) {
      const newAddress = { ...address, id: crypto.randomUUID() };
      
      // If this is the first address or is marked default, make sure it's the only default
      const updatedAddresses = [...user.addresses];
      
      if (newAddress.isDefault) {
        updatedAddresses.forEach(addr => {
          if (addr.type === newAddress.type) {
            addr.isDefault = false;
          }
        });
      }
      
      // If this is the first address of its type, make it default
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
        
        // If setting this address as default, update other addresses of same type
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
