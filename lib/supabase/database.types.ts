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
        Insert: Omit<Database['public']['Tables']['posts']['Row'], 'createdAt' | 'updatedAt'>;
        Update: Partial<Database['public']['Tables']['posts']['Insert']>;
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
        Insert: Omit<Database['public']['Tables']['field_notes']['Row'], 'createdAt' | 'updatedAt'>;
        Update: Partial<Database['public']['Tables']['field_notes']['Insert']>;
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
        Insert: Omit<Database['public']['Tables']['questions']['Row'], 'createdAt' | 'updatedAt'>;
        Update: Partial<Database['public']['Tables']['questions']['Insert']>;
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
        Insert: Omit<Database['public']['Tables']['thought_fragments']['Row'], 'createdAt' | 'updatedAt'>;
        Update: Partial<Database['public']['Tables']['thought_fragments']['Insert']>;
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
        Insert: Omit<Database['public']['Tables']['journal_moments']['Row'], 'createdAt' | 'updatedAt'>;
        Update: Partial<Database['public']['Tables']['journal_moments']['Insert']>;
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
        Insert: Omit<Database['public']['Tables']['fragments']['Row'], 'createdAt' | 'updatedAt'>;
        Update: Partial<Database['public']['Tables']['fragments']['Insert']>;
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
        Insert: Omit<Database['public']['Tables']['books']['Row'], 'createdAt' | 'updatedAt'>;
        Update: Partial<Database['public']['Tables']['books']['Insert']>;
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
        Insert: Omit<Database['public']['Tables']['builder_statuses']['Row'], 'createdAt' | 'updatedAt'>;
        Update: Partial<Database['public']['Tables']['builder_statuses']['Insert']>;
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
        Insert: Omit<Database['public']['Tables']['active_systems']['Row'], 'createdAt' | 'updatedAt'>;
        Update: Partial<Database['public']['Tables']['active_systems']['Insert']>;
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
        Insert: Omit<Database['public']['Tables']['build_logs']['Row'], 'createdAt' | 'updatedAt'>;
        Update: Partial<Database['public']['Tables']['build_logs']['Insert']>;
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
        Insert: Omit<Database['public']['Tables']['operator_focuses']['Row'], 'createdAt' | 'updatedAt'>;
        Update: Partial<Database['public']['Tables']['operator_focuses']['Insert']>;
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
        Insert: Omit<Database['public']['Tables']['redistribution_records']['Row'], 'createdAt' | 'updatedAt'>;
        Update: Partial<Database['public']['Tables']['redistribution_records']['Insert']>;
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
        Insert: Omit<Database['public']['Tables']['newsletter_issues']['Row'], 'createdAt' | 'updatedAt'>;
        Update: Partial<Database['public']['Tables']['newsletter_issues']['Insert']>;
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
        Insert: Omit<Database['public']['Tables']['newsletter_profiles']['Row'], 'createdAt' | 'updatedAt'>;
        Update: Partial<Database['public']['Tables']['newsletter_profiles']['Insert']>;
      };
      subscribers: {
        Row: {
          id: string;
          email: string;
          isVerified: boolean;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Omit<Database['public']['Tables']['subscribers']['Row'], 'createdAt' | 'updatedAt'>;
        Update: Partial<Database['public']['Tables']['subscribers']['Insert']>;
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
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'createdAt' | 'updatedAt'>;
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>;
      };
      donations: {
        Row: {
          id: string;
          amount: number;
          donorName: string | null;
          donorEmail: string | null;
          donorPhone: string | null;
          razorpayOrderId: string | null;
          razorpayPaymentId: string | null;
          status: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Partial<Omit<Database['public']['Tables']['donations']['Row'], 'createdAt' | 'updatedAt'>>;
        Update: Partial<Database['public']['Tables']['donations']['Insert']>;
      };
    };
  };
};
