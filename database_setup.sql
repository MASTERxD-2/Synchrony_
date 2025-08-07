-- Synchrony Onboarding Database Setup

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('intern', 'worker')) DEFAULT 'intern',
  department TEXT CHECK (department IN ('engineering', 'marketing', 'sales', 'hr', 'design')) DEFAULT 'engineering',
  level TEXT CHECK (level IN ('junior', 'mid', 'senior')) DEFAULT 'junior',
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create preboarding_checklists table
CREATE TABLE IF NOT EXISTS preboarding_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  offer_letter BOOLEAN DEFAULT FALSE,
  background_verification BOOLEAN DEFAULT FALSE,
  identity_proof BOOLEAN DEFAULT FALSE,
  bank_details BOOLEAN DEFAULT FALSE,
  emergency_contacts BOOLEAN DEFAULT FALSE,
  equipment_shipped BOOLEAN DEFAULT FALSE,
  welcome_email BOOLEAN DEFAULT FALSE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create onboarding_checklists table
CREATE TABLE IF NOT EXISTS onboarding_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create checklist_items table
CREATE TABLE IF NOT EXISTS checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_id UUID REFERENCES onboarding_checklists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  estimated_time INTEGER DEFAULT 30,
  completed BOOLEAN DEFAULT FALSE,
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_preboarding_checklists_user_id ON preboarding_checklists(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_checklists_user_id ON onboarding_checklists(user_id);
CREATE INDEX IF NOT EXISTS idx_checklist_items_checklist_id ON checklist_items(checklist_id);
CREATE INDEX IF NOT EXISTS idx_checklist_items_completed ON checklist_items(completed);

-- Create triggers to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_preboarding_checklists_updated_at BEFORE UPDATE ON preboarding_checklists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_onboarding_checklists_updated_at BEFORE UPDATE ON onboarding_checklists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checklist_items_updated_at BEFORE UPDATE ON checklist_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) for data protection
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE preboarding_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can view their own preboarding checklist" ON preboarding_checklists;
DROP POLICY IF EXISTS "Users can update their own preboarding checklist" ON preboarding_checklists;
DROP POLICY IF EXISTS "Users can insert their own preboarding checklist" ON preboarding_checklists;
DROP POLICY IF EXISTS "Users can view their own onboarding checklist" ON onboarding_checklists;
DROP POLICY IF EXISTS "Users can update their own onboarding checklist" ON onboarding_checklists;
DROP POLICY IF EXISTS "Users can insert their own onboarding checklist" ON onboarding_checklists;
DROP POLICY IF EXISTS "Users can view their own checklist items" ON checklist_items;
DROP POLICY IF EXISTS "Users can update their own checklist items" ON checklist_items;
DROP POLICY IF EXISTS "Users can insert their own checklist items" ON checklist_items;
DROP POLICY IF EXISTS "Users can delete their own checklist items" ON checklist_items;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for preboarding_checklists table
CREATE POLICY "Users can view their own preboarding checklist" ON preboarding_checklists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preboarding checklist" ON preboarding_checklists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preboarding checklist" ON preboarding_checklists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for onboarding_checklists table  
CREATE POLICY "Users can view their own onboarding checklist" ON onboarding_checklists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding checklist" ON onboarding_checklists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding checklist" ON onboarding_checklists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for checklist_items table
CREATE POLICY "Users can view their own checklist items" ON checklist_items
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM onboarding_checklists WHERE id = checklist_id
    )
  );

CREATE POLICY "Users can update their own checklist items" ON checklist_items
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM onboarding_checklists WHERE id = checklist_id
    )
  );

CREATE POLICY "Users can insert their own checklist items" ON checklist_items
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM onboarding_checklists WHERE id = checklist_id
    )
  );

CREATE POLICY "Users can delete their own checklist items" ON checklist_items
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM onboarding_checklists WHERE id = checklist_id
    )
  );