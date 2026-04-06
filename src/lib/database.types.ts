// Auto-generated type definitions for Kingdom Arts Academy Supabase schema
// Run: npx supabase gen types typescript --project-id xmsvufqsoqipzspjysvx > src/lib/database.types.ts

export type UserRole = 'student' | 'instructor' | 'admin' | 'guest';
export type UserStatus = 'active' | 'pending' | 'suspended' | 'on_leave';
export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
export type EnrollmentStatus = 'active' | 'completed' | 'dropped';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          role: UserRole;
          avatar_url: string | null;
          bio: string | null;
          instrument: string | null;
          city: string | null;
          status: UserStatus;
          level: number;
          xp: number;
          xp_to_next: number;
          crowns: number;
          streak: number;
          invite_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string;
          instrument: string;
          level: CourseLevel;
          instructor_id: string;
          thumbnail_url: string | null;
          price: number;
          duration_weeks: number;
          lesson_count: number;
          rating: number;
          review_count: number;
          is_published: boolean;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['courses']['Row'], 'created_at' | 'updated_at' | 'id'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['courses']['Insert']>;
      };
      lessons: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          description: string | null;
          video_url: string | null;
          duration_minutes: number;
          order_index: number;
          is_free_preview: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['lessons']['Row'], 'created_at' | 'id'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['lessons']['Insert']>;
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          status: EnrollmentStatus;
          progress: number;
          enrolled_at: string;
          completed_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['enrollments']['Row'], 'id' | 'enrolled_at'> & {
          id?: string;
          enrolled_at?: string;
        };
        Update: Partial<Database['public']['Tables']['enrollments']['Insert']>;
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };
      community_posts: {
        Row: {
          id: string;
          author_id: string;
          content: string;
          category: string;
          likes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['community_posts']['Row'], 'id' | 'created_at' | 'updated_at' | 'likes'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          likes?: number;
        };
        Update: Partial<Database['public']['Tables']['community_posts']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      user_status: UserStatus;
      course_level: CourseLevel;
      enrollment_status: EnrollmentStatus;
    };
  };
}
