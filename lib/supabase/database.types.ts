export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          persona: string;
          title: string;
          subtitle: string | null;
          slug: string;
          excerpt: string | null;
          coverImageUrl: string | null;
          coverImageAlt: string | null;
          coverImageCaption: string | null;
          coverImageLocation: string | null;
          coverImageCredit: string | null;
          autoCoverImage: boolean;
          content: string;
          tags: string[];
          publishedAt: string | null;
          featured: boolean;
          hidden: boolean;
          draft: boolean;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Omit<Database['public']['Tables']['posts']['Row'], 'id' | 'createdAt' | 'updatedAt'> & { id?: string };
        Update: Partial<Database['public']['Tables']['posts']['Insert']>;
        Relationships: [];
      };
      field_notes: {
        Row: {
          id: string;
          title: string;
          excerpt: string | null;
          content: string;
          category: string;
          publishedAt: string | null;
          featured: boolean;
          hidden: boolean;
          draft: boolean;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Omit<Database['public']['Tables']['field_notes']['Row'], 'id' | 'createdAt' | 'updatedAt'> & { id?: string };
        Update: Partial<Database['public']['Tables']['field_notes']['Insert']>;
        Relationships: [];
      };
      questions: {
        Row: {
          id: string;
          text: string;
          order: number;
          hidden: boolean;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Omit<Database['public']['Tables']['questions']['Row'], 'id' | 'createdAt' | 'updatedAt'> & { id?: string };
        Update: Partial<Database['public']['Tables']['questions']['Insert']>;
        Relationships: [];
      };
      thought_fragments: {
        Row: {
          id: string;
          text: string;
          publishedAt: string | null;
          hidden: boolean;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Omit<Database['public']['Tables']['thought_fragments']['Row'], 'id' | 'createdAt' | 'updatedAt'> & { id?: string };
        Update: Partial<Database['public']['Tables']['thought_fragments']['Insert']>;
        Relationships: [];
      };
      journal_moments: {
        Row: {
          id: string;
          title: string;
          body: string;
          timeLabel: string;
          hidden: boolean;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Omit<Database['public']['Tables']['journal_moments']['Row'], 'id' | 'createdAt' | 'updatedAt'> & { id?: string };
        Update: Partial<Database['public']['Tables']['journal_moments']['Insert']>;
        Relationships: [];
      };
      fragments: {
        Row: {
          id: string;
          quote: string;
          source: string;
          hidden: boolean;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Omit<Database['public']['Tables']['fragments']['Row'], 'id' | 'createdAt' | 'updatedAt'> & { id?: string };
        Update: Partial<Database['public']['Tables']['fragments']['Insert']>;
        Relationships: [];
      };
      books: {
        Row: {
          id: string;
          title: string;
          author: string;
          coverImage: string | null;
          category: string;
          status: 'reading' | 'finished' | 'paused' | 'wishlist';
          notes: string | null;
          featured: boolean;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Omit<Database['public']['Tables']['books']['Row'], 'id' | 'createdAt' | 'updatedAt'> & { id?: string };
        Update: Partial<Database['public']['Tables']['books']['Insert']>;
        Relationships: [];
      };
      builder_statuses: {
        Row: {
          id: string;
          operationalState: string;
          statusText: string;
          currentFocus: string;
          lastUpdated: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Omit<Database['public']['Tables']['builder_statuses']['Row'], 'id' | 'createdAt' | 'updatedAt'> & { id?: string };
        Update: Partial<Database['public']['Tables']['builder_statuses']['Insert']>;
        Relationships: [];
      };
      active_systems: {
        Row: {
          id: string;
          title: string;
          description: string;
          status: string;
          stack: string[];
          updatedAt: string;
          order: number;
          hidden: boolean;
          createdAt: string;
        };
        Insert: Omit<Database['public']['Tables']['active_systems']['Row'], 'id' | 'createdAt' | 'updatedAt'> & { id?: string };
        Update: Partial<Database['public']['Tables']['active_systems']['Insert']>;
        Relationships: [];
      };
      build_logs: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          date: string;
          source: 'manual' | 'automated';
          aiGenerated: boolean;
          relatedCommits: string[];
          relatedRepositories: string[];
          hidden: boolean;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Omit<Database['public']['Tables']['build_logs']['Row'], 'id' | 'createdAt' | 'updatedAt'> & { id?: string };
        Update: Partial<Database['public']['Tables']['build_logs']['Insert']>;
        Relationships: [];
      };
      operator_focuses: {
        Row: {
          id: string;
          label: string;
          value: string;
          order: number;
          hidden: boolean;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Omit<Database['public']['Tables']['operator_focuses']['Row'], 'id' | 'createdAt' | 'updatedAt'> & { id?: string };
        Update: Partial<Database['public']['Tables']['operator_focuses']['Insert']>;
        Relationships: [];
      };
      redistribution_records: {
        Row: {
          id: string;
          amount: number;
          destination: string;
          description: string;
          proofUrl: string | null;
          donatedAt: string;
          transactionReference: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Omit<Database['public']['Tables']['redistribution_records']['Row'], 'id' | 'createdAt' | 'updatedAt'> & { id?: string };
        Update: Partial<Database['public']['Tables']['redistribution_records']['Insert']>;
        Relationships: [];
      };
      newsletter_issues: {
        Row: {
          id: string;
          persona: string;
          title: string;
          content: string;
          publishedAt: string | null;
          hidden: boolean;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Omit<Database['public']['Tables']['newsletter_issues']['Row'], 'id' | 'createdAt' | 'updatedAt'> & { id?: string };
        Update: Partial<Database['public']['Tables']['newsletter_issues']['Insert']>;
        Relationships: [];
      };
      newsletter_profiles: {
        Row: {
          id: string;
          persona: string;
          description: string;
          frequencyText: string;
          philosophyText: string;
          expectationItems: string[];
          createdAt: string;
          updatedAt: string;
        };
        Insert: Omit<Database['public']['Tables']['newsletter_profiles']['Row'], 'id' | 'createdAt' | 'updatedAt'> & { id?: string };
        Update: Partial<Database['public']['Tables']['newsletter_profiles']['Insert']>;
        Relationships: [];
      };
      subscribers: {
        Row: {
          id: string;
          email: string;
          isVerified: boolean;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Omit<Partial<Database['public']['Tables']['subscribers']['Row']>, 'email'> & { email: string };
        Update: Partial<Database['public']['Tables']['subscribers']['Insert']>;
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          subscriberId: string;
          persona: string;
          active: boolean;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'id' | 'createdAt' | 'updatedAt'> & { id?: string };
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>;
        Relationships: [];
      };
      donations: {
        Row: {
          id: string;
          amount: number;
          donorName: string | null;
          donorEmail: string | null;
          donorPhone: string | null;
          publicName: string | null;
          razorpayOrderId: string | null;
          razorpayPaymentId: string | null;
          status: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          amount: number;
          donorName?: string | null;
          donorEmail?: string | null;
          donorPhone?: string | null;
          publicName?: string | null;
          razorpayOrderId?: string | null;
          razorpayPaymentId?: string | null;
          status?: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          amount?: number;
          donorName?: string | null;
          donorEmail?: string | null;
          donorPhone?: string | null;
          publicName?: string | null;
          razorpayOrderId?: string | null;
          razorpayPaymentId?: string | null;
          status?: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never
    };
    Functions: {
      [_ in never]: never
    };
    Enums: {
      [_ in never]: never
    };
    CompositeTypes: {
      [_ in never]: never
    };
  };
};
