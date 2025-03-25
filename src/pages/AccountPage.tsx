
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  UserRound, 
  Mail, 
  Phone, 
  CalendarDays,
  Plus
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from '@/components/ui/alert';

const AccountPage = () => {
  const { user, isLoading, updateUserProfile, addAddress, updateAddress, removeAddress } = useAuth();
  const navigate = useNavigate();
  
  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  
  // Address form state
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressFullName, setAddressFullName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [addressPhone, setAddressPhone] = useState('');
  const [addressType, setAddressType] = useState<'shipping' | 'billing'>('shipping');
  const [isDefault, setIsDefault] = useState(false);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      toast.error('Please log in to access your account');
      navigate('/login');
    }
  }, [user, isLoading, navigate]);
  
  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setDateOfBirth(user.dateOfBirth || '');
      setGender(user.gender || '');
      setProfilePicture(user.profilePicture || '');
    }
  }, [user]);
  
  // Handle profile update
  const handleProfileUpdate = () => {
    updateUserProfile({
      name,
      phone,
      dateOfBirth,
      gender: gender as any,
      profilePicture
    });
    toast.success('Profile updated successfully');
  };
  
  // Get initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Reset the address form
  const resetAddressForm = () => {
    setEditingAddressId(null);
    setAddressFullName('');
    setStreet('');
    setCity('');
    setState('');
    setPostalCode('');
    setCountry('India');
    setAddressPhone('');
    setAddressType('shipping');
    setIsDefault(false);
  };
  
  // Open dialog to add a new address
  const handleAddNewAddress = () => {
    resetAddressForm();
    setIsAddressDialogOpen(true);
  };
  
  // Open dialog to edit an existing address
  const handleEditAddress = (address: any) => {
    setEditingAddressId(address.id);
    setAddressFullName(address.fullName);
    setStreet(address.streetAddress);
    setCity(address.city);
    setState(address.state);
    setPostalCode(address.postalCode);
    setCountry(address.country);
    setAddressPhone(address.phone || '');
    setAddressType(address.type);
    setIsDefault(!!address.isDefault);
    setIsAddressDialogOpen(true);
  };
  
  // Handle address save (add or update)
  const handleSaveAddress = () => {
    const addressData = {
      fullName: addressFullName,
      streetAddress: street,
      city,
      state,
      postalCode,
      country,
      phone: addressPhone,
      type: addressType,
      isDefault
    };
    
    if (editingAddressId) {
      updateAddress(editingAddressId, addressData);
      toast.success('Address updated successfully');
    } else {
      addAddress(addressData);
      toast.success('Address added successfully');
    }
    
    setIsAddressDialogOpen(false);
    resetAddressForm();
  };
  
  // Handle address deletion
  const handleDeleteAddress = (id: string) => {
    removeAddress(id);
    toast.success('Address removed successfully');
  };
  
  // Get default address of a particular type
  const getDefaultAddress = (type: 'shipping' | 'billing') => {
    return user?.addresses.find(addr => addr.type === type && addr.isDefault);
  };
  
  if (isLoading) {
    return <Layout><div className="container py-16 text-center">Loading...</div></Layout>;
  }
  
  if (!user) {
    return (
      <Layout>
        <div className="container py-16">
          <Alert>
            <AlertDescription>
              Please <a href="/login" className="underline font-medium">sign in</a> to view your account information.
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-3xl font-light mb-8">My Account</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Personal Information</TabsTrigger>
            <TabsTrigger value="addresses">Address Book</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>Your avatar will be shown across the site</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={profilePicture} alt={name} />
                    <AvatarFallback className="text-lg">{getInitials(name)}</AvatarFallback>
                  </Avatar>
                  <Input
                    className="max-w-sm"
                    placeholder="Profile image URL (optional)"
                    value={profilePicture}
                    onChange={(e) => setProfilePicture(e.target.value)}
                  />
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Details</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <UserRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        className="pl-10"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        className="pl-10"
                        value={user.email}
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        className="pl-10"
                        placeholder="+91 9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth (optional)</Label>
                      <div className="relative">
                        <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="dob"
                          type="date"
                          className="pl-10"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                        />
                      </div>
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
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleProfileUpdate}>Save Changes</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Default Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Default Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  {getDefaultAddress('shipping') ? (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="font-medium">{getDefaultAddress('shipping')?.fullName}</p>
                        <p>{getDefaultAddress('shipping')?.streetAddress}</p>
                        <p>
                          {getDefaultAddress('shipping')?.city}, {getDefaultAddress('shipping')?.state} {getDefaultAddress('shipping')?.postalCode}
                        </p>
                        <p>{getDefaultAddress('shipping')?.country}</p>
                        {getDefaultAddress('shipping')?.phone && (
                          <p className="text-sm text-muted-foreground">{getDefaultAddress('shipping')?.phone}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditAddress(getDefaultAddress('shipping'))}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDeleteAddress(getDefaultAddress('shipping')?.id || '')}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground mb-4">No default shipping address set</p>
                      <Button variant="outline" onClick={handleAddNewAddress}>
                        Add Shipping Address
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Default Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Default Billing Address</CardTitle>
                </CardHeader>
                <CardContent>
                  {getDefaultAddress('billing') ? (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="font-medium">{getDefaultAddress('billing')?.fullName}</p>
                        <p>{getDefaultAddress('billing')?.streetAddress}</p>
                        <p>
                          {getDefaultAddress('billing')?.city}, {getDefaultAddress('billing')?.state} {getDefaultAddress('billing')?.postalCode}
                        </p>
                        <p>{getDefaultAddress('billing')?.country}</p>
                        {getDefaultAddress('billing')?.phone && (
                          <p className="text-sm text-muted-foreground">{getDefaultAddress('billing')?.phone}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditAddress(getDefaultAddress('billing'))}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDeleteAddress(getDefaultAddress('billing')?.id || '')}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground mb-4">No default billing address set</p>
                      <Button variant="outline" onClick={handleAddNewAddress}>
                        Add Billing Address
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* All Addresses */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>All Addresses</CardTitle>
                    <CardDescription>Manage your saved addresses</CardDescription>
                  </div>
                  <Button onClick={handleAddNewAddress}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Address
                  </Button>
                </CardHeader>
                <CardContent>
                  {user.addresses.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">You haven't added any addresses yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {user.addresses.map(address => (
                        <div key={address.id} className="border p-4 rounded-lg relative">
                          {address.isDefault && (
                            <span className="absolute top-2 right-2 bg-primary/10 text-primary text-xs rounded-full px-2 py-1">
                              Default {address.type}
                            </span>
                          )}
                          <div className="space-y-1 mb-4">
                            <p className="font-medium">{address.fullName}</p>
                            <p>{address.streetAddress}</p>
                            <p>
                              {address.city}, {address.state} {address.postalCode}
                            </p>
                            <p>{address.country}</p>
                            {address.phone && (
                              <p className="text-sm text-muted-foreground">{address.phone}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              {address.type.charAt(0).toUpperCase() + address.type.slice(1)} address
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditAddress(address)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleDeleteAddress(address.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Address Dialog */}
        <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {editingAddressId ? 'Edit Address' : 'Add New Address'}
              </DialogTitle>
              <DialogDescription>
                Fill in the details for your {addressType} address.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="address-fullname">Full Name</Label>
                  <Input
                    id="address-fullname"
                    value={addressFullName}
                    onChange={(e) => setAddressFullName(e.target.value)}
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="address-street">Street Address</Label>
                  <Input
                    id="address-street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />
                </div>
                
                <div className="col-span-1">
                  <Label htmlFor="address-city">City</Label>
                  <Input
                    id="address-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                
                <div className="col-span-1">
                  <Label htmlFor="address-state">State</Label>
                  <Input
                    id="address-state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                
                <div className="col-span-1">
                  <Label htmlFor="address-postal">Postal Code</Label>
                  <Input
                    id="address-postal"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
                
                <div className="col-span-1">
                  <Label htmlFor="address-country">Country</Label>
                  <Input
                    id="address-country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="address-phone">Phone Number</Label>
                  <Input
                    id="address-phone"
                    value={addressPhone}
                    onChange={(e) => setAddressPhone(e.target.value)}
                  />
                </div>
                
                <div className="col-span-1">
                  <Label htmlFor="address-type">Address Type</Label>
                  <Select value={addressType} onValueChange={(value: any) => setAddressType(value)}>
                    <SelectTrigger id="address-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shipping">Shipping</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-1 flex items-end">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="set-default"
                      className="h-4 w-4"
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                    />
                    <Label htmlFor="set-default" className="text-sm font-normal">
                      Set as default {addressType} address
                    </Label>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddressDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveAddress}>
                {editingAddressId ? 'Update Address' : 'Save Address'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AccountPage;
