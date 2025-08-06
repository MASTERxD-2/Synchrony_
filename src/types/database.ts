// Database types that match Supabase schema
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: 'intern' | 'worker'
          department: 'engineering' | 'marketing' | 'sales' | 'hr' | 'design'
          level: 'junior' | 'mid' | 'senior'
          start_date: string
          avatar: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          role?: 'intern' | 'worker'
          department?: 'engineering' | 'marketing' | 'sales' | 'hr' | 'design'
          level?: 'junior' | 'mid' | 'senior'
          start_date?: string
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'intern' | 'worker'
          department?: 'engineering' | 'marketing' | 'sales' | 'hr' | 'design'
          level?: 'junior' | 'mid' | 'senior'
          start_date?: string
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      onboarding_checklists: {
        Row: {
          id: string
          user_id: string
          progress: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          progress?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          progress?: number
          created_at?: string
          updated_at?: string
        }
      }
      checklist_items: {
        Row: {
          id: string
          checklist_id: string
          title: string
          description: string | null
          category: string | null
          priority: 'high' | 'medium' | 'low'
          estimated_time: number
          completed: boolean
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          checklist_id: string
          title: string
          description?: string | null
          category?: string | null
          priority?: 'high' | 'medium' | 'low'
          estimated_time?: number
          completed?: boolean
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          checklist_id?: string
          title?: string
          description?: string | null
          category?: string | null
          priority?: 'high' | 'medium' | 'low'
          estimated_time?: number
          completed?: boolean
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
