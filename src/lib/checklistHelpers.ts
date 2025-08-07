import { supabase } from './supabase';

// Pre-boarding checklist types
export interface PreboardingChecklistData {
  offerLetter: boolean;
  backgroundVerification: boolean;
  identityProof: boolean;
  bankDetails: boolean;
  emergencyContacts: boolean;
  equipmentShipped: boolean;
  welcomeEmail: boolean;
}

// Onboarding checklist types  
export interface OnboardingTaskData {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
  completed: boolean;
  dueDate?: string;
}

export interface OnboardingChecklistData {
  id: string;
  items: OnboardingTaskData[];
  progress: number;
  createdAt: string;
  updatedAt: string;
}

// Pre-boarding checklist functions
export const savePreboardingChecklist = async (userId: string, checklistData: PreboardingChecklistData) => {
  try {
    const completedItems = Object.values(checklistData).filter(Boolean).length;
    const totalItems = Object.keys(checklistData).length;
    const progress = Math.round((completedItems / totalItems) * 100);

    // Use upsert with conflict resolution on user_id
    const { data, error } = await supabase
      .from('preboarding_checklists')
      .upsert({
        user_id: userId,
        offer_letter: checklistData.offerLetter,
        background_verification: checklistData.backgroundVerification,
        identity_proof: checklistData.identityProof,
        bank_details: checklistData.bankDetails,
        emergency_contacts: checklistData.emergencyContacts,
        equipment_shipped: checklistData.equipmentShipped,
        welcome_email: checklistData.welcomeEmail,
        progress,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving preboarding checklist:', error);
      throw error;
    }

    console.log('Successfully saved preboarding checklist:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Error in savePreboardingChecklist:', error);
    return { data: null, error };
  }
};

export const loadPreboardingChecklist = async (userId: string): Promise<PreboardingChecklistData | null> => {
  try {
    console.log('Loading preboarding checklist for user:', userId);
    
    const { data, error } = await supabase
      .from('preboarding_checklists')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - this is expected for new users
        console.log('No preboarding checklist found for user:', userId, '(new user)');
        return null;
      }
      console.error('Database error loading preboarding checklist:', error);
      return null;
    }

    if (!data) {
      console.log('No preboarding checklist data for user:', userId);
      return null;
    }

    console.log('Successfully loaded preboarding checklist:', data);

    return {
      offerLetter: data.offer_letter,
      backgroundVerification: data.background_verification,
      identityProof: data.identity_proof,
      bankDetails: data.bank_details,
      emergencyContacts: data.emergency_contacts,
      equipmentShipped: data.equipment_shipped,
      welcomeEmail: data.welcome_email,
    };
  } catch (error) {
    console.error('Error loading preboarding checklist:', error);
    return null;
  }
};

// Onboarding checklist functions
export const saveOnboardingChecklist = async (userId: string, checklistData: OnboardingChecklistData) => {
  try {
    // Save the main checklist record
    const { data: checklistRecord, error: checklistError } = await supabase
      .from('onboarding_checklists')
      .upsert({
        id: checklistData.id,
        user_id: userId,
        progress: checklistData.progress,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (checklistError) {
      console.error('Error saving onboarding checklist:', checklistError);
      throw checklistError;
    }

    // Delete existing checklist items for this checklist
    await supabase
      .from('checklist_items')
      .delete()
      .eq('checklist_id', checklistData.id);

    // Save all checklist items
    const itemsToInsert = checklistData.items.map(item => ({
      id: item.id,
      checklist_id: checklistData.id,
      title: item.title,
      description: item.description,
      category: item.category,
      priority: item.priority,
      estimated_time: item.estimatedTime,
      completed: item.completed,
      due_date: item.dueDate || null,
      updated_at: new Date().toISOString(),
    }));

    const { error: itemsError } = await supabase
      .from('checklist_items')
      .insert(itemsToInsert);

    if (itemsError) {
      console.error('Error saving checklist items:', itemsError);
      throw itemsError;
    }

    return { data: checklistRecord, error: null };
  } catch (error) {
    console.error('Error in saveOnboardingChecklist:', error);
    return { data: null, error };
  }
};

export const loadOnboardingChecklist = async (userId: string): Promise<OnboardingChecklistData | null> => {
  try {
    // Load the main checklist record
    const { data: checklistRecord, error: checklistError } = await supabase
      .from('onboarding_checklists')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (checklistError || !checklistRecord) {
      console.log('No onboarding checklist found for user:', userId);
      return null;
    }

    // Load the checklist items
    const { data: items, error: itemsError } = await supabase
      .from('checklist_items')
      .select('*')
      .eq('checklist_id', checklistRecord.id)
      .order('created_at');

    if (itemsError) {
      console.error('Error loading checklist items:', itemsError);
      return null;
    }

    // Convert database format to app format
    const checklistItems: OnboardingTaskData[] = (items || []).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description || '',
      category: item.category || '',
      priority: item.priority,
      estimatedTime: item.estimated_time,
      completed: item.completed,
      dueDate: item.due_date || undefined,
    }));

    return {
      id: checklistRecord.id,
      items: checklistItems,
      progress: checklistRecord.progress,
      createdAt: checklistRecord.created_at,
      updatedAt: checklistRecord.updated_at,
    };
  } catch (error) {
    console.error('Error loading onboarding checklist:', error);
    return null;
  }
};

// Utility function to generate a UUID
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
