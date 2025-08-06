import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/User';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ error?: any }>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  changePassword: (newPassword: string) => Promise<{ error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setSupabaseUser(session.user);
          // Load profile in background, don't wait
          loadUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setSupabaseUser(session.user);
          // Don't wait for profile loading, do it in background
          loadUserProfile(session.user.id).finally(() => {
            setLoading(false);
          });
        } else {
          setSupabaseUser(null);
          setUser(null);
          localStorage.removeItem('currentUser');
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      // Try to load user profile from Supabase with a timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile load timeout')), 5000)
      );

      const profilePromise = supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([profilePromise, timeoutPromise]) as any;

      if (data && !error) {
        // Map database fields to User interface
        const userData: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          department: data.department,
          level: data.level,
          startDate: data.start_date,
          avatar: data.avatar || undefined,
        };
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
      } else {
        // If no profile in database, create a basic user object from auth data
        const { data: authUser } = await supabase.auth.getUser();
        if (authUser.user) {
          const basicUser: User = {
            id: authUser.user.id,
            name: authUser.user.user_metadata?.name || authUser.user.email?.split('@')[0] || 'User',
            email: authUser.user.email || '',
            role: 'intern',
            department: 'engineering',
            level: 'junior',
            startDate: new Date().toISOString(),
          };
          setUser(basicUser);
          localStorage.setItem('currentUser', JSON.stringify(basicUser));
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      
      // Create a basic user object from auth data as fallback
      try {
        const { data: authUser } = await supabase.auth.getUser();
        if (authUser.user) {
          const basicUser: User = {
            id: authUser.user.id,
            name: authUser.user.user_metadata?.name || authUser.user.email?.split('@')[0] || 'User',
            email: authUser.user.email || '',
            role: 'intern',
            department: 'engineering',
            level: 'junior',
            startDate: new Date().toISOString(),
          };
          setUser(basicUser);
          localStorage.setItem('currentUser', JSON.stringify(basicUser));
        }
      } catch (authError) {
        console.error('Error getting auth user:', authError);
        // Final fallback to localStorage
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      }
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) return { error };

      // If signup successful, create user profile
      if (data.user) {
        const userProfile: User = {
          id: data.user.id,
          email: data.user.email || email,
          name: userData.name || '',
          role: userData.role || 'intern',
          department: userData.department || 'engineering',
          level: userData.level || 'junior',
          startDate: userData.startDate || new Date().toISOString(),
          avatar: userData.avatar,
        };

        // Save to local state
        setUser(userProfile);
        localStorage.setItem('currentUser', JSON.stringify(userProfile));

        // Try to save to Supabase (will succeed once you create the users table)
        try {
          await supabase.from('users').insert(userProfile);
        } catch (dbError) {
          console.warn('Could not save user profile to database:', dbError);
        }
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const changePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSupabaseUser(null);
    localStorage.removeItem('currentUser');
  };

  const isAuthenticated = !!user && !!supabaseUser;

  return (
    <AuthContext.Provider value={{ 
      user, 
      supabaseUser, 
      login, 
      logout, 
      isAuthenticated, 
      loading,
      signUp,
      signIn,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};
