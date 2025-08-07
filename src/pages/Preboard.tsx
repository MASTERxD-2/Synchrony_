import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { savePreboardingChecklist, loadPreboardingChecklist, PreboardingChecklistData } from '@/lib/checklistHelpers';

const PreboardingContent = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [checklistItems, setChecklistItems] = useState<PreboardingChecklistData>({
    offerLetter: false,
    backgroundVerification: false,
    identityProof: false,
    bankDetails: false,
    emergencyContacts: false,
    equipmentShipped: false,
    welcomeEmail: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load checklist data when user is authenticated
  useEffect(() => {
    const loadChecklistData = async () => {
      if (isAuthenticated && user) {
        console.log('Loading checklist for authenticated user:', user.id);
        try {
          const savedChecklist = await loadPreboardingChecklist(user.id);
          if (savedChecklist) {
            console.log('Loaded checklist from database:', savedChecklist);
            setChecklistItems(savedChecklist);
          } else {
            // Try localStorage fallback
            const localData = localStorage.getItem(`preboard_checklist_${user.id}`);
            if (localData) {
              console.log('Loading from localStorage fallback');
              const parsedData = JSON.parse(localData);
              setChecklistItems(parsedData);
              // Try to save to database for future use
              try {
                await savePreboardingChecklist(user.id, parsedData);
                console.log('Migrated localStorage data to database');
              } catch (saveError) {
                console.error('Could not migrate localStorage data:', saveError);
              }
            } else {
              console.log('No saved checklist found - using defaults');
            }
          }
        } catch (error) {
          console.error('Error loading preboarding checklist:', error);
          // Fall back to localStorage if database fails
          const localData = localStorage.getItem(`preboard_checklist_${user.id}`);
          if (localData) {
            console.log('Using localStorage fallback due to database error');
            setChecklistItems(JSON.parse(localData));
          }
        }
      } else {
        // Load guest data from localStorage if not authenticated
        const guestData = localStorage.getItem('preboard_checklist_guest');
        if (guestData) {
          console.log('Loading guest data from localStorage');
          setChecklistItems(JSON.parse(guestData));
        }
      }
      setLoading(false);
    };

    loadChecklistData();
  }, [isAuthenticated, user]);

  const handleCheckboxChange = async (itemName: keyof PreboardingChecklistData) => {
    const newChecklistItems = {
      ...checklistItems,
      [itemName]: !checklistItems[itemName],
    };
    
    console.log('Checkbox changed:', itemName, 'New value:', newChecklistItems[itemName]);
    console.log('Full checklist state:', newChecklistItems);
    
    setChecklistItems(newChecklistItems);

    // Save to database if user is authenticated
    if (isAuthenticated && user) {
      try {
        setSaving(true);
        console.log('Saving to database for user:', user.id);
        const result = await savePreboardingChecklist(user.id, newChecklistItems);
        console.log('Save result:', result);
        
        // Also save to localStorage as backup
        localStorage.setItem(`preboard_checklist_${user.id}`, JSON.stringify(newChecklistItems));
        console.log('Saved to localStorage as backup');
      } catch (error) {
        console.error('Error saving preboarding checklist:', error);
        // Still save to localStorage as fallback
        localStorage.setItem(`preboard_checklist_${user.id}`, JSON.stringify(newChecklistItems));
        console.log('Saved to localStorage as fallback');
      } finally {
        setSaving(false);
      }
    } else {
      // Save to localStorage if not authenticated
      localStorage.setItem('preboard_checklist_guest', JSON.stringify(newChecklistItems));
      console.log('Saved guest data to localStorage');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAuthenticated && user) {
      try {
        setSaving(true);
        await savePreboardingChecklist(user.id, checklistItems);
        localStorage.setItem(`preboard_checklist_${user.id}`, JSON.stringify(checklistItems));
      } catch (error) {
        console.error('Error saving preboarding checklist:', error);
        localStorage.setItem(`preboard_checklist_${user.id}`, JSON.stringify(checklistItems));
      } finally {
        setSaving(false);
      }
    }
    
    const completedItems = Object.values(checklistItems).filter(Boolean).length;
    const totalItems = Object.keys(checklistItems).length;
    
    console.log('Pre-joining Checklist:', checklistItems);
    alert(`Checklist updated! ${completedItems}/${totalItems} items completed.`);
  };

  const getCompletionPercentage = () => {
    const completedItems = Object.values(checklistItems).filter(Boolean).length;
    const totalItems = Object.keys(checklistItems).length;
    return Math.round((completedItems / totalItems) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your checklist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="text-gray-600 body-font py-6">
        <div className="container mx-auto flex flex-wrap flex-col md:flex-row items-center">
          <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <img src="/logo.png" alt="Synchrony Logo" className="mx-auto h-16 w-auto" />
            <span className="ml-3 text-2xl font-semibold text-gray-800"></span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Pre-Joining Checklist</h1>
          <p className="text-center text-gray-600 mb-8">Complete these items before your first day</p>

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
              {/* Offer Letter */}
              <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  id="offerLetter"
                  checked={checklistItems.offerLetter}
                  onChange={() => handleCheckboxChange('offerLetter')}
                  className="mt-1 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label htmlFor="offerLetter" className="flex-1">
                  <span className="font-medium text-gray-800">Offer letter signed and returned</span>
                  <p className="text-sm text-gray-600 mt-1">Sign and return your offer letter to confirm acceptance</p>
                </label>
              </div>

              {/* Background Verification */}
              <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  id="backgroundVerification"
                  checked={checklistItems.backgroundVerification}
                  onChange={() => handleCheckboxChange('backgroundVerification')}
                  className="mt-1 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label htmlFor="backgroundVerification" className="flex-1">
                  <span className="font-medium text-gray-800">Background verification initiated/completed</span>
                  <p className="text-sm text-gray-600 mt-1">Complete the background verification process</p>
                </label>
              </div>

              {/* Identity Proof */}
              <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  id="identityProof"
                  checked={checklistItems.identityProof}
                  onChange={() => handleCheckboxChange('identityProof')}
                  className="mt-1 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label htmlFor="identityProof" className="flex-1">
                  <span className="font-medium text-gray-800">Identity proof submitted (Aadhar, PAN, Passport, etc.)</span>
                  <p className="text-sm text-gray-600 mt-1">Submit valid government-issued identity documents</p>
                </label>
              </div>

              {/* Bank Details */}
              <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  id="bankDetails"
                  checked={checklistItems.bankDetails}
                  onChange={() => handleCheckboxChange('bankDetails')}
                  className="mt-1 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label htmlFor="bankDetails" className="flex-1">
                  <span className="font-medium text-gray-800">Bank account details submitted (for salary)</span>
                  <p className="text-sm text-gray-600 mt-1">Provide bank account information for salary processing</p>
                </label>
              </div>

              {/* Emergency Contacts */}
              <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  id="emergencyContacts"
                  checked={checklistItems.emergencyContacts}
                  onChange={() => handleCheckboxChange('emergencyContacts')}
                  className="mt-1 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label htmlFor="emergencyContacts" className="flex-1">
                  <span className="font-medium text-gray-800">Emergency contact details shared</span>
                  <p className="text-sm text-gray-600 mt-1">Provide emergency contact information for safety purposes</p>
                </label>
              </div>

              {/* Equipment Shipped */}
              <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  id="equipmentShipped"
                  checked={checklistItems.equipmentShipped}
                  onChange={() => handleCheckboxChange('equipmentShipped')}
                  className="mt-1 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label htmlFor="equipmentShipped" className="flex-1">
                  <span className="font-medium text-gray-800">Laptop or equipment shipped (if remote)</span>
                  <p className="text-sm text-gray-600 mt-1">Confirm receipt of work equipment for remote employees</p>
                </label>
              </div>

              {/* Welcome Email */}
              <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  id="welcomeEmail"
                  checked={checklistItems.welcomeEmail}
                  onChange={() => handleCheckboxChange('welcomeEmail')}
                  className="mt-1 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label htmlFor="welcomeEmail" className="flex-1">
                  <span className="font-medium text-gray-800">Welcome email sent with joining instructions</span>
                  <p className="text-sm text-gray-600 mt-1">Receive and review your welcome email with first-day instructions</p>
                </label>
              </div>
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

      {/* Footer */}
      <footer className="text-gray-600 body-font mt-12">
        <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
          <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
            <img src="/logo.png" alt="Synchrony Logo" className="mx-auto h-16 w-auto mb-4" />
            <span className="ml-3 text-xl"></span>
          </a>
          <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
            © 2025 Synchrony
          </p>
        </div>
      </footer>
    </div>
  );
};

const Preboarding: React.FC = () => {
  return (
    <AuthProvider>
      <PreboardingContent />
    </AuthProvider>
  );
};

export default Preboarding;
