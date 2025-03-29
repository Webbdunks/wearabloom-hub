import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserAddress } from "@/types";

type User = {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  profilePicture?: string;
  addresses: UserAddress[];
  isAdmin?: boolean;
} | null;

type AuthContextType = {
  user: User;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ isAdmin: boolean }>;
  signup: (email: string, password: string, name?: string, phone?: string, gender?: string, isAdmin?: boolean) => Promise<void>;
  logout: () => void;
  updateUserProfile: (userData: Partial<Omit<NonNullable<User>, 'id' | 'email' | 'addresses' | 'isAdmin'>>) => void;
  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Omit<UserAddress, 'id'>>) => void;
  removeAddress: (id: string) => void;
  checkIsAdmin: (userId: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to check if user is admin
  const checkIsAdmin = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .rpc('is_admin', { user_id: userId });
        
      if (error) {
        console.error("Error checking admin status:", error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error("Error in checkIsAdmin:", error);
      return false;
    }
  };

  // Helper function to fetch user profile data - moved outside the listener to avoid deadlocks
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        return null;
      }
      
      return profileData;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      return null;
    }
  };

  // Helper function to fetch user addresses
  const fetchUserAddresses = async (userId: string) => {
    try {
      const { data: addressesData, error: addressesError } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', userId);
        
      if (addressesError) {
        console.error("Error fetching addresses:", addressesError);
        return [];
      }
      
      // Transform from database format to our UserAddress type
      return addressesData.map(addr => ({
        id: addr.id,
        fullName: addr.full_name,
        streetAddress: addr.street_address,
        city: addr.city,
        state: addr.state,
        postalCode: addr.postal_code,
        country: addr.country,
        phone: addr.phone,
        isDefault: addr.is_default,
        type: addr.type as 'shipping' | 'billing'
      }));
    } catch (error) {
      console.error("Error in fetchUserAddresses:", error);
      return [];
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        setIsLoading(true);
        
        if (session?.user) {
          // Use setTimeout to avoid deadlocks with Supabase auth
          setTimeout(async () => {
            const profileData = await fetchUserProfile(session.user.id);
            const addresses = await fetchUserAddresses(session.user.id);
            const isAdmin = await checkIsAdmin(session.user.id);
            
            const userData: User = {
              id: session.user.id,
              email: profileData?.email || session.user.email!,
              name: profileData?.full_name || session.user.user_metadata?.full_name,
              phone: profileData?.phone,
              gender: profileData?.gender as any,
              profilePicture: profileData?.avatar_url,
              addresses: addresses,
              isAdmin: isAdmin
            };
            
            setUser(userData);
            setIsLoading(false);
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profileData = await fetchUserProfile(session.user.id);
        const addresses = await fetchUserAddresses(session.user.id);
        const isAdmin = await checkIsAdmin(session.user.id);
        
        const userData: User = {
          id: session.user.id,
          email: profileData?.email || session.user.email!,
          name: profileData?.full_name || session.user.user_metadata?.full_name,
          phone: profileData?.phone,
          gender: profileData?.gender as any,
          profilePicture: profileData?.avatar_url,
          addresses: addresses,
          isAdmin: isAdmin
        };
        
        setUser(userData);
      }
      
      setIsLoading(false);
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
      
      // Check if the user is an admin
      const { data: session } = await supabase.auth.getSession();
      let isAdmin = false;
      
      if (session && session.session) {
        isAdmin = await checkIsAdmin(session.session.user.id);
      }
      
      toast.success('Successfully logged in');
      return { isAdmin };
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.message || 'Invalid email or password. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name?: string, phone?: string, gender?: string, isAdmin?: boolean) => {
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
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name || email.split('@')[0],
            phone: phone,
            gender: gender,
            is_admin: isAdmin || false,
          },
        }
      });
      
      if (error) throw error;
      
      // If this signup is for an admin, add to admin_users table
      if (isAdmin && data.user) {
        const { error: adminError } = await supabase
          .from('admin_users')
          .insert([
            { user_id: data.user.id }
          ]);
          
        if (adminError) {
          console.error("Error adding user to admin_users:", adminError);
          // Continue registration even if admin role assignment fails
          // User can be manually assigned admin role later
        }
      }
      
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

  const updateUserProfile = async (userData: Partial<Omit<NonNullable<User>, 'id' | 'email' | 'addresses' | 'isAdmin'>>) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: userData.name,
            avatar_url: userData.profilePicture,
            phone: userData.phone,
            gender: userData.gender,
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

  const addAddress = async (address: Omit<UserAddress, 'id'>) => {
    if (user) {
      try {
        // Check if this should be the default address for its type
        const existingDefault = user.addresses.some(addr => 
          addr.type === address.type && addr.isDefault
        );

        const isDefault = address.isDefault ?? !existingDefault;

        // Insert into database
        const { data, error } = await supabase
          .from('user_addresses')
          .insert({
            user_id: user.id,
            full_name: address.fullName,
            street_address: address.streetAddress,
            city: address.city,
            state: address.state,
            postal_code: address.postalCode,
            country: address.country,
            phone: address.phone,
            type: address.type,
            is_default: isDefault
          })
          .select('*')
          .single();

        if (error) throw error;

        // If this is set as default, update any other addresses of the same type
        if (isDefault) {
          await supabase
            .from('user_addresses')
            .update({ is_default: false })
            .eq('user_id', user.id)
            .eq('type', address.type)
            .neq('id', data.id);
          
          // Update local state for other addresses
          const updatedAddresses = user.addresses.map(addr => {
            if (addr.type === address.type) {
              return { ...addr, isDefault: false };
            }
            return addr;
          });
          
          // Add the new address to local state
          const newAddress: UserAddress = {
            id: data.id,
            fullName: data.full_name,
            streetAddress: data.street_address,
            city: data.city,
            state: data.state,
            postalCode: data.postal_code,
            country: data.country,
            phone: data.phone,
            isDefault: data.is_default,
            type: data.type as 'shipping' | 'billing'
          };
          
          setUser({
            ...user,
            addresses: [...updatedAddresses, newAddress]
          });
        } else {
          // Just add the new address to local state
          const newAddress: UserAddress = {
            id: data.id,
            fullName: data.full_name,
            streetAddress: data.street_address,
            city: data.city,
            state: data.state,
            postalCode: data.postal_code,
            country: data.country,
            phone: data.phone,
            isDefault: data.is_default,
            type: data.type as 'shipping' | 'billing'
          };
          
          setUser({
            ...user,
            addresses: [...user.addresses, newAddress]
          });
        }
        
        toast.success('Address added successfully');
      } catch (error) {
        console.error("Error adding address:", error);
        toast.error('Failed to add address. Please try again.');
      }
    }
  };

  const updateAddress = async (id: string, addressUpdate: Partial<Omit<UserAddress, 'id'>>) => {
    if (user) {
      try {
        // Prepare the update data in snake_case for the database
        const updateData: Record<string, any> = {};
        
        if (addressUpdate.fullName !== undefined) updateData.full_name = addressUpdate.fullName;
        if (addressUpdate.streetAddress !== undefined) updateData.street_address = addressUpdate.streetAddress;
        if (addressUpdate.city !== undefined) updateData.city = addressUpdate.city;
        if (addressUpdate.state !== undefined) updateData.state = addressUpdate.state;
        if (addressUpdate.postalCode !== undefined) updateData.postal_code = addressUpdate.postalCode;
        if (addressUpdate.country !== undefined) updateData.country = addressUpdate.country;
        if (addressUpdate.phone !== undefined) updateData.phone = addressUpdate.phone;
        if (addressUpdate.type !== undefined) updateData.type = addressUpdate.type;
        if (addressUpdate.isDefault !== undefined) updateData.is_default = addressUpdate.isDefault;
        
        updateData.updated_at = new Date().toISOString();
        
        // Update the address in the database
        const { data, error } = await supabase
          .from('user_addresses')
          .update(updateData)
          .eq('id', id)
          .eq('user_id', user.id)
          .select('*')
          .single();
          
        if (error) throw error;
        
        // If this address is being set as default, update any other addresses of the same type
        if (addressUpdate.isDefault) {
          await supabase
            .from('user_addresses')
            .update({ is_default: false })
            .eq('user_id', user.id)
            .eq('type', data.type)
            .neq('id', id);
        }
        
        // Refresh the addresses to ensure we have the most up-to-date data
        const addresses = await fetchUserAddresses(user.id);
        
        setUser({
          ...user,
          addresses: addresses
        });
        
        toast.success('Address updated successfully');
      } catch (error) {
        console.error("Error updating address:", error);
        toast.error('Failed to update address. Please try again.');
      }
    }
  };

  const removeAddress = async (id: string) => {
    if (user) {
      try {
        // Delete the address from the database
        const { error } = await supabase
          .from('user_addresses')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        // Update the local state by removing the deleted address
        setUser({
          ...user,
          addresses: user.addresses.filter(addr => addr.id !== id)
        });
        
        toast.success('Address removed successfully');
      } catch (error) {
        console.error("Error removing address:", error);
        toast.error('Failed to remove address. Please try again.');
      }
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
      removeAddress,
      checkIsAdmin
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
