import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import { User } from '@/types/User';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user: contextUser, supabaseUser } = useAuth();
  const [user, setUser] = useState<User | null>(contextUser);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Fetch user profile from Supabase on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!supabaseUser?.id) {
        setIsLoadingProfile(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', supabaseUser.id)
          .single();

        if (data && !error) {
          // Map database fields to User interface
          const userData: User = {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
            department: data.department,
            level: data.level,
            startDate: data.start_date, // Map start_date to startDate
            avatar: data.avatar || undefined,
          };
          setUser(userData);
        } else {
          console.error('Error fetching user profile:', error);
          // If no profile in database, use context user or create default
          if (contextUser) {
            setUser(contextUser);
          } else {
            // Create a basic user object from Supabase auth data
            setUser({
              id: supabaseUser.id,
              name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
              email: supabaseUser.email || '',
              role: 'intern',
              department: 'engineering',
              level: 'junior',
              startDate: new Date().toISOString(),
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUser(contextUser);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [supabaseUser?.id, contextUser]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Update password directly with Supabase
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Password updated successfully!');
        // Clear form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <Header />

      {/* Sidebar */}
      <Sidebar />

      <main className="pt-20 sm:ml-64 px-6">
        <div className="max-w-4xl mx-auto py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  View your profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingProfile ? (
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label>Full Name</Label>
                      <p className="text-sm text-gray-700 mt-1 p-2 bg-gray-50 rounded">
                        {user?.name || 'Not set'}
                      </p>
                    </div>
                    
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm text-gray-700 mt-1 p-2 bg-gray-50 rounded">
                        {user?.email || 'Not set'}
                      </p>
                    </div>
                    
                    <div>
                      <Label>Role</Label>
                      <p className="text-sm text-gray-700 mt-1 p-2 bg-gray-50 rounded capitalize">
                        {user?.role || 'Not set'}
                      </p>
                    </div>
                    
                    <div>
                      <Label>Department</Label>
                      <p className="text-sm text-gray-700 mt-1 p-2 bg-gray-50 rounded capitalize">
                        {user?.department || 'Not set'}
                      </p>
                    </div>
                    
                    <div>
                      <Label>Level</Label>
                      <p className="text-sm text-gray-700 mt-1 p-2 bg-gray-50 rounded capitalize">
                        {user?.level || 'Not set'}
                      </p>
                    </div>
                    
                    <div>
                      <Label>Start Date</Label>
                      <p className="text-sm text-gray-700 mt-1 p-2 bg-gray-50 rounded">
                        {user?.startDate ? new Date(user.startDate).toLocaleDateString() : 'Not set'}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password for better security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="border-green-200 bg-green-50">
                      <AlertDescription className="text-green-800">
                        {success}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Change Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SettingsPage;
