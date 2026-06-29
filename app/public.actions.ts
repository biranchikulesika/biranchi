'use server';

import { getPostsMeta } from '@/lib/queries';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { z } from 'zod';

export async function searchPublishedPosts(query: string) {
  if (!query) return [];
  return await getPostsMeta(query);
}

const subscribeSchema = z.object({
  email: z.string().email(),
  personas: z.array(z.string()).min(1),
  source: z.string().optional()
});

export async function subscribeNewsletter(email: string, personas: string[], source: string) {
  try {
    const validData = subscribeSchema.parse({ email, personas, source });
    const admin = getSupabaseAdmin();

    // Upsert subscriber
    const { data: subscriber, error: subError } = await admin
      .from('subscribers')
      .upsert({ email: validData.email }, { onConflict: 'email' })
      .select('id')
      .single();

    if (subError || !subscriber) {
      console.error('Failed to subscribe:', subError);
      return { success: false, error: 'Failed to subscribe. Please try again.' };
    }

    // Insert subscriptions
    const subscriptionsToInsert = validData.personas.map(p => ({
      subscriberId: subscriber.id,
      persona: p,
      active: true
    }));

    // Insert ignoring conflicts on unique constraint (subscriberId, persona)
    const { error: insertError } = await admin
      .from('subscriptions')
      .upsert(subscriptionsToInsert, { onConflict: 'subscriberId,persona' });


    return { success: true };
  } catch (err: any) {
    console.error('Subscription error:', err);
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}

export async function getPublicDonations() {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from('donations')
    .select('id, amount, publicName, createdAt, status')
    .eq('status', 'success')
    .order('createdAt', { ascending: false });
    
  if (error) {
    console.error('Error fetching public donations:', error);
    return [];
  }
  
  // Map publicName, falling back to 'Contributor' if null
  return data.map(d => ({
    ...d,
    donorName: d.publicName || 'Contributor'
  }));
}
