const fs = require('fs');
const path = require('path');

const libDir = path.join(__dirname, 'lib');
const supabaseDir = path.join(libDir, 'supabase');
const repoDir = path.join(libDir, 'repositories');
const serviceDir = path.join(libDir, 'services');

if (!fs.existsSync(supabaseDir)) fs.mkdirSync(supabaseDir, { recursive: true });

// 1. Create client.ts
const clientContent = `import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
`;
fs.writeFileSync(path.join(supabaseDir, 'client.ts'), clientContent);

// 2. Create server.ts
const serverContent = `import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabaseServer = createClient<Database>(supabaseUrl, supabaseServiceKey);
`;
fs.writeFileSync(path.join(supabaseDir, 'server.ts'), serverContent);

// 3. Create database.types.ts
const dbTypesContent = `export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

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
          cover_image: string | null;
          content: string;
          tags: string[];
          published_at: string | null;
          featured: boolean;
          hidden: boolean;
          draft: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['posts']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['posts']['Insert']>;
      };
      field_notes: {
        Row: {
          id: string;
          title: string;
          excerpt: string | null;
          content: string;
          category: string;
          published_at: string | null;
          featured: boolean;
          hidden: boolean;
          draft: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['field_notes']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['field_notes']['Insert']>;
      };
      questions: {
        Row: {
          id: string;
          text: string;
          order_idx: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['questions']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['questions']['Insert']>;
      };
      thought_fragments: {
        Row: {
          id: string;
          text: string;
          published_at: string | null;
          hidden: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['thought_fragments']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['thought_fragments']['Insert']>;
      };
      journal_moments: {
        Row: {
          id: string;
          title: string;
          body: string;
          time_label: string;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['journal_moments']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['journal_moments']['Insert']>;
      };
      fragments: {
        Row: {
          id: string;
          quote: string;
          source: string;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['fragments']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['fragments']['Insert']>;
      };
      books: {
        Row: {
          id: string;
          title: string;
          author: string;
          cover_image: string | null;
          category: string;
          status: 'reading' | 'finished' | 'paused' | 'wishlist';
          notes: string | null;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['books']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['books']['Insert']>;
      };
      builder_statuses: {
        Row: {
          id: string;
          operational_state: string;
          status_text: string;
          current_focus: string;
          last_updated: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['builder_statuses']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['builder_statuses']['Insert']>;
      };
      active_systems: {
        Row: {
          id: string;
          title: string;
          description: string;
          status: string;
          stack: string[];
          updated_at: string;
          order_idx: number;
          hidden: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['active_systems']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['active_systems']['Insert']>;
      };
      build_logs: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          date: string;
          source: 'manual' | 'git';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['build_logs']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['build_logs']['Insert']>;
      };
      operator_focuses: {
        Row: {
          id: string;
          label: string;
          value: string;
          order_idx: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['operator_focuses']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['operator_focuses']['Insert']>;
      };
      redistribution_records: {
        Row: {
          id: string;
          amount: number;
          destination: string;
          description: string;
          proof_url: string | null;
          donated_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['redistribution_records']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['redistribution_records']['Insert']>;
      };
      newsletter_issues: {
        Row: {
          id: string;
          persona: string;
          title: string;
          content: string;
          published_at: string | null;
          hidden: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['newsletter_issues']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['newsletter_issues']['Insert']>;
      };
      newsletter_profiles: {
        Row: {
          id: string;
          persona: string;
          description: string;
          frequency_text: string;
          philosophy_text: string;
          expectation_items: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['newsletter_profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['newsletter_profiles']['Insert']>;
      };
    };
  };
};
`;
fs.writeFileSync(path.join(supabaseDir, 'database.types.ts'), dbTypesContent);

// 4. Create schema.sql
const sqlContent = \`-- SUPABASE SCHEMA GENERATION

CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  persona TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  published_at TIMESTAMPTZ,
  featured BOOLEAN DEFAULT false,
  hidden BOOLEAN DEFAULT false,
  draft BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- (Other tables similarly defined... omitting the full SQL generation for brevity since we aren't executing it automatically for the user context, but including some examples)

CREATE TABLE field_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  featured BOOLEAN DEFAULT false,
  hidden BOOLEAN DEFAULT false,
  draft BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  order_idx INTEGER NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE thought_fragments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE journal_moments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  time_label TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE fragments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  source TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_image TEXT,
  category TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('reading', 'finished', 'paused', 'wishlist')),
  notes TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE builder_statuses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  operational_state TEXT NOT NULL,
  status_text TEXT NOT NULL,
  current_focus TEXT NOT NULL,
  last_updated TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE active_systems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  stack TEXT[] DEFAULT '{}',
  updated_at TEXT NOT NULL,
  order_idx INTEGER NOT NULL,
  hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE build_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('manual', 'git')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE operator_focuses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  order_idx INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE redistribution_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  amount NUMERIC NOT NULL,
  destination TEXT NOT NULL,
  description TEXT NOT NULL,
  proof_url TEXT,
  donated_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE newsletter_issues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  persona TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE newsletter_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  persona TEXT NOT NULL,
  description TEXT NOT NULL,
  frequency_text TEXT NOT NULL,
  philosophy_text TEXT NOT NULL,
  expectation_items TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
\`;
fs.writeFileSync(path.join(supabaseDir, 'schema.sql'), sqlContent);

console.log("Supabase base configured");

const entities = [
  { name: 'post', type: 'Post', table: 'posts' },
  { name: 'fieldNote', type: 'FieldNote', table: 'field_notes' },
  { name: 'thoughtFragment', type: 'ThoughtFragment', table: 'thought_fragments' },
  { name: 'question', type: 'Question', table: 'questions' },
  { name: 'journalMoment', type: 'JournalMoment', table: 'journal_moments' },
  { name: 'fragment', type: 'Fragment', table: 'fragments' },
  { name: 'builderStatus', type: 'BuilderStatus', table: 'builder_statuses' },
  { name: 'activeSystem', type: 'ActiveSystem', table: 'active_systems' },
  { name: 'buildLog', type: 'BuildLog', table: 'build_logs' },
  { name: 'operatorFocus', type: 'OperatorFocus', table: 'operator_focuses' },
  { name: 'redistributionRecord', type: 'RedistributionRecord', table: 'redistribution_records' },
  { name: 'newsletterIssue', type: 'NewsletterIssue', table: 'newsletter_issues' },
  { name: 'newsletterProfile', type: 'NewsletterProfile', table: 'newsletter_profiles' },
  { name: 'book', type: 'Book', table: 'books' }
];

// Create Repository Registry
const registryContent = \`import getConfig from 'next/config';

// Import Mocks
\${entities.map(e => \`import { \${e.type}MockRepository } from './\${e.name}.repository.mock';\`).join('\\n')}

// Import Supabase
\${entities.map(e => \`import { \${e.type}SupabaseRepository } from './\${e.name}.repository.supabase';\`).join('\\n')}

// Base type interfaces to ensure compatibility
export interface IRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(data: Omit<T, 'id'>): Promise<T | null>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

// Registry singleton to provide active repositories
export class RepositoryRegistry {
  private static instance: RepositoryRegistry;
  private useSupabase: boolean = false; // Toggle this from env var or config

  private constructor() {
    this.useSupabase = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';
  }

  public static getInstance(): RepositoryRegistry {
    if (!RepositoryRegistry.instance) {
      RepositoryRegistry.instance = new RepositoryRegistry();
    }
    return RepositoryRegistry.instance;
  }

\${entities.map(e => \`
  get\${e.type}Repository(): IRepository<any> {
    return this.useSupabase ? new \${e.type}SupabaseRepository() : new \${e.type}MockRepository();
  }
\`).join('\\n')}
}

export const repositoryRegistry = RepositoryRegistry.getInstance();
\`;
fs.writeFileSync(path.join(repoDir, 'registry.ts'), registryContent);

entities.forEach(entity => {
  // 1. Rename existing repository to .mock.ts
  const oldRepoPath = path.join(repoDir, \`\${entity.name}.repository.ts\`);
  const mockRepoPath = path.join(repoDir, \`\${entity.name}.repository.mock.ts\`);
  if (fs.existsSync(oldRepoPath)) {
    let mockContentText = fs.readFileSync(oldRepoPath, 'utf8');
    // Rename class to MockRepository
    mockContentText = mockContentText.replace(\`class \${entity.type}Repository \`, \`class \${entity.type}MockRepository implements IRepository<\${entity.type}> \`);
    
    // add import for IRepository
    mockContentText = \`import { IRepository } from './registry';\\n\` + mockContentText;
    
    fs.writeFileSync(mockRepoPath, mockContentText);
    fs.unlinkSync(oldRepoPath);
  }

  // 2. Create .supabase.ts
  const supabaseRepoPath = path.join(repoDir, \`\${entity.name}.repository.supabase.ts\`);
  const supabaseContent = \`import { \${entity.type} } from '../types';
import { IRepository } from './registry';
import { supabaseServer } from '../supabase/server';

export class \${entity.type}SupabaseRepository implements IRepository<\${entity.type}> {
  async getAll(): Promise<\${entity.type}[]> {
    const { data, error } = await supabaseServer.from('\${entity.table}').select('*');
    if (error) throw error;
    // Map db columns to app types
    return data as any as \${entity.type}[];
  }

  async getById(id: string): Promise<\${entity.type} | null> {
    const { data, error } = await supabaseServer.from('\${entity.table}').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    return data as any as \${entity.type};
  }

  async create(data: Omit<\${entity.type}, 'id'>): Promise<\${entity.type} | null> {
    // Map camelCase to snake_case if doing full mapper, but for now we expect raw data matching or simple mapping
    const { data: result, error } = await supabaseServer.from('\${entity.table}').insert(data as any).select().single();
    if (error) throw error;
    return result as any as \${entity.type};
  }

  async update(id: string, data: Partial<\${entity.type}>): Promise<\${entity.type} | null> {
    const { data: result, error } = await supabaseServer.from('\${entity.table}').update(data as any).eq('id', id).select().single();
    if (error) throw error;
    return result as any as \${entity.type};
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabaseServer.from('\${entity.table}').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}
\`;
  fs.writeFileSync(supabaseRepoPath, supabaseContent);

  // 3. Keep a simple forwarding repository with old name OR change the Service
  // Instead of a forwarding repo, we can update the service layer to use the registry.
  
  const servicePath = path.join(serviceDir, \`\${entity.name}.service.ts\`);
  if (fs.existsSync(servicePath)) {
    let serviceContentText = fs.readFileSync(servicePath, 'utf8');
    
    // Replace import of repository to registry
    serviceContentText = serviceContentText.replace(
      new RegExp(\`import { \${entity.type}Repository } from '../repositories/\${entity.name}.repository';\`, 'g'),
      \`import { repositoryRegistry, IRepository } from '../repositories/registry';\`
    );
    
    // Replace property type
    serviceContentText = serviceContentText.replace(
      new RegExp(\`private repository: \${entity.type}Repository;\`, 'g'),
      \`private repository: IRepository<\${entity.type}>;\`
    );

    // Replace initialization
    serviceContentText = serviceContentText.replace(
      new RegExp(\`this.repository = new \${entity.type}Repository[(][)];\`, 'g'),
      \`this.repository = repositoryRegistry.get\${entity.type}Repository();\`
    );
    
    fs.writeFileSync(servicePath, serviceContentText);
  }
});

console.log("Refactoring complete");
