import React, { useState, useEffect } from 'react';
import { User as UserType, OnboardingChecklist } from '@/types/User';
import { ChecklistGenerator } from '@/utils/ChecklistGenerator';
import { 
  saveOnboardingChecklist, 
  loadOnboardingChecklist, 
  OnboardingChecklistData, 
  OnboardingTaskData,
  generateUUID 
} from '@/lib/checklistHelpers';

interface OnboardingDashboardProps {
  user: UserType;
}

const OnboardingDashboard: React.FC<OnboardingDashboardProps> = ({ user }) => {
  const [checklist, setChecklist] = useState<OnboardingChecklistData | null>(null);
  const [generator] = useState(new ChecklistGenerator());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadChecklistData = async () => {
      console.log('🔄 Loading checklist data for user:', user.id);
      console.log('👤 User object:', user);
      
      try {
        // Try to load from database first
        console.log('📋 Attempting to load from database...');
        const savedChecklist = await loadOnboardingChecklist(user.id);
        
        if (savedChecklist) {
          console.log('✅ Found saved checklist in database:', savedChecklist);
          setChecklist(savedChecklist);
        } else {
          console.log('❌ No checklist found in database, checking localStorage...');
          
          // Try multiple localStorage keys as fallback (in case user ID changed)
          const possibleKeys = [
            `checklist_${user.id}`,
            `checklist_${user.email}`, // Fallback to email-based key
            'checklist_current_user' // Generic fallback
          ];
          
          let localData = null;
          let usedKey = null;
          
          for (const key of possibleKeys) {
            console.log('🔑 Checking localStorage key:', key);
            localData = localStorage.getItem(key);
            if (localData) {
              usedKey = key;
              console.log('📦 Found data with key:', key);
              break;
            }
          }
          
          if (localData) {
            console.log('📦 Found data in localStorage, migrating...');
            // Migrate from localStorage format to new format
            const oldChecklist: OnboardingChecklist = JSON.parse(localData);
            const newChecklistData: OnboardingChecklistData = {
              id: generateUUID(),
              items: oldChecklist.items.map(item => ({
                id: item.id,
                title: item.title,
                description: item.description,
                category: item.category,
                priority: item.priority,
                estimatedTime: item.estimatedTime,
                completed: item.completed,
                dueDate: item.dueDate,
              })),
              progress: oldChecklist.progress,
              createdAt: oldChecklist.createdAt,
              updatedAt: oldChecklist.updatedAt,
            };
            
            setChecklist(newChecklistData);
            
            // Save migrated data to database
            try {
              await saveOnboardingChecklist(user.id, newChecklistData);
              // Remove old localStorage data after successful migration
              if (usedKey) {
                localStorage.removeItem(usedKey);
                console.log('🗑️ Removed old localStorage data:', usedKey);
              }
            } catch (error) {
              console.error('Error migrating checklist to database:', error);
            }
          } else {
            console.log('🆕 No existing data found, generating new checklist...');
            // Generate new checklist
            const newOnboardingChecklist = generator.generateChecklist(user);
            const newChecklistData: OnboardingChecklistData = {
              id: generateUUID(),
              items: newOnboardingChecklist.items.map(item => ({
                id: item.id,
                title: item.title,
                description: item.description,
                category: item.category,
                priority: item.priority,
                estimatedTime: item.estimatedTime,
                completed: item.completed,
                dueDate: item.dueDate,
              })),
              progress: newOnboardingChecklist.progress,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            
            setChecklist(newChecklistData);
            
            // Save new checklist to database
            try {
              console.log('💾 Saving new checklist to database...');
              await saveOnboardingChecklist(user.id, newChecklistData);
              console.log('✅ Successfully saved new checklist to database');
            } catch (error) {
              console.error('Error saving new checklist to database:', error);
              // Fallback to localStorage
              const fallbackKey = `checklist_${user.id}`;
              localStorage.setItem(fallbackKey, JSON.stringify(newOnboardingChecklist));
            }
          }
        }
      } catch (error) {
        console.error('❌ Error loading checklist from database:', error);
        console.log('🔄 Falling back to localStorage...');
        
        // Fallback to localStorage if database fails
        const fallbackKey = `checklist_${user.id}`;
        const savedChecklist = localStorage.getItem(fallbackKey);
        if (savedChecklist) {
          console.log('📦 Found fallback data in localStorage');
          const oldChecklist: OnboardingChecklist = JSON.parse(savedChecklist);
          const fallbackData: OnboardingChecklistData = {
            id: generateUUID(),
            items: oldChecklist.items.map(item => ({
              id: item.id,
              title: item.title,
              description: item.description,
              category: item.category,
              priority: item.priority,
              estimatedTime: item.estimatedTime,
              completed: item.completed,
              dueDate: item.dueDate,
            })),
            progress: oldChecklist.progress,
            createdAt: oldChecklist.createdAt,
            updatedAt: oldChecklist.updatedAt,
          };
          setChecklist(fallbackData);
        } else {
          // Last resort: generate new checklist
          const newChecklist = generator.generateChecklist(user);
          const lastResortData: OnboardingChecklistData = {
            id: generateUUID(),
            items: newChecklist.items.map(item => ({
              id: item.id,
              title: item.title,
              description: item.description,
              category: item.category,
              priority: item.priority,
              estimatedTime: item.estimatedTime,
              completed: item.completed,
              dueDate: item.dueDate,
            })),
            progress: newChecklist.progress,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setChecklist(lastResortData);
          const lastResortKey = `checklist_${user.id}`;
          localStorage.setItem(lastResortKey, JSON.stringify(newChecklist));
        }
      } finally {
        setLoading(false);
      }
    };

    loadChecklistData();
  }, [user, generator]);

  const handleTaskToggle = async (taskId: string) => {
    if (!checklist) return;

    console.log('🔄 Toggling task:', taskId, 'for user:', user.id);

    const updatedItems = checklist.items.map(item =>
      item.id === taskId ? { ...item, completed: !item.completed } : item
    );

    const completedCount = updatedItems.filter(item => item.completed).length;
    const progress = Math.round((completedCount / updatedItems.length) * 100);

    const updatedChecklist: OnboardingChecklistData = {
      ...checklist,
      items: updatedItems,
      progress,
      updatedAt: new Date().toISOString(),
    };

    setChecklist(updatedChecklist);

    // Save to database
    try {
      setSaving(true);
      console.log('💾 Auto-saving checklist to database for user:', user.id);
      await saveOnboardingChecklist(user.id, updatedChecklist);
      console.log('✅ Auto-save successful');
      // Also save to localStorage as backup with multiple keys for reliability
      const backupFormat: OnboardingChecklist = {
        ...updatedChecklist,
        userId: user.id,
      };
      localStorage.setItem(`checklist_${user.id}`, JSON.stringify(backupFormat));
      localStorage.setItem(`checklist_${user.email}`, JSON.stringify(backupFormat)); // Extra backup
      localStorage.setItem('checklist_current_user', JSON.stringify(backupFormat)); // Generic backup
    } catch (error) {
      console.error('❌ Auto-save failed:', error);
      // Fallback to localStorage
      const backupFormat: OnboardingChecklist = {
        ...updatedChecklist,
        userId: user.id,
      };
      localStorage.setItem(`checklist_${user.id}`, JSON.stringify(backupFormat));
      localStorage.setItem(`checklist_${user.email}`, JSON.stringify(backupFormat)); // Extra backup
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checklist) return;

    try {
      setSaving(true);
      console.log('💾 Manual save - saving checklist for user:', user.id);
      console.log('📋 Checklist data being saved:', checklist);
      await saveOnboardingChecklist(user.id, checklist);
      
      // Also save to localStorage as backup with multiple keys
      const backupFormat: OnboardingChecklist = {
        ...checklist,
        userId: user.id,
      };
      localStorage.setItem(`checklist_${user.id}`, JSON.stringify(backupFormat));
      localStorage.setItem(`checklist_${user.email}`, JSON.stringify(backupFormat)); // Extra backup
      localStorage.setItem('checklist_current_user', JSON.stringify(backupFormat)); // Generic backup
      
      const completedItems = checklist.items.filter(item => item.completed).length;
      const totalItems = checklist.items.length;
      
      console.log('✅ Manual save successful!', completedItems, 'of', totalItems, 'completed');
      alert(`Checklist updated! ${completedItems}/${totalItems} items completed.`);
    } catch (error) {
      console.error('Error updating checklist:', error);
      alert('Error updating checklist. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getCompletionPercentage = () => {
    if (!checklist) return 0;
    const completedItems = checklist.items.filter(item => item.completed).length;
    const totalItems = checklist.items.length;
    return Math.round((completedItems / totalItems) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your onboarding checklist...</p>
        </div>
      </div>
    );
  }

  if (!checklist) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Main Content */}
      <main className="flex-grow py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Day 1: Welcome & Introduction</h1>
          <p className="text-center text-gray-600 mb-8">Complete these items on your first day</p>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">{getCompletionPercentage()}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getCompletionPercentage()}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Checklist Items */}
            <div className="space-y-4">
              {checklist.items.map((item) => (
                <div key={item.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    id={item.id}
                    checked={item.completed}
                    onChange={() => handleTaskToggle(item.id)}
                    className="mt-1 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <label htmlFor={item.id} className="flex-1">
                    <span className="font-medium text-gray-800">{item.title}</span>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </label>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6">
              <button
                type="submit"
                disabled={saving}
                className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-md transition-colors duration-200 flex items-center mx-auto"
              >
                {saving && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                )}
                {saving ? 'Saving...' : 'Update Checklist'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default OnboardingDashboard;
