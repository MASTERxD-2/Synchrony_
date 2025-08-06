import { supabase } from './supabase';
import { User } from '@/types/User';

export const userHelpers = {
  // Insert a new user directly into the database
  insertUser: async (userData: Omit<User, 'avatar'> & { avatar?: string }) => {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select();
    
    return { data, error };
  },

  // Get user by ID
  getUserById: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    return { data, error };
  },

  // Get user by email
  getUserByEmail: async (email: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    return { data, error };
  },

  // Update user profile
  updateUser: async (userId: string, updates: Partial<User>) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select();
    
    return { data, error };
  }
};

// Example usage function for your specific case
export const insertOmsaiUser = async () => {
  const userData = {
    id: '07ca6a9a-db27-4c7f-a3b1-3c7f94d3c809',
    name: 'Omsai Vikrantha',
    email: 'omsaivikrantha@gmail.com',
    role: 'intern' as const,
    department: 'engineering' as const,
    level: 'junior' as const,
    startDate: new Date().toISOString(),
  };

  return await userHelpers.insertUser(userData);
};
