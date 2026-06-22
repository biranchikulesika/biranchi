'use server';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth/verify';
import { NewsletterProfileService } from '@/lib/services/newsletterProfile.service';

const newsletterProfileService = new NewsletterProfileService();

// Define a basic Zod schema for payload validation
const payloadSchema = z.record(z.any());
// We keep it flexible to avoid breaking the UI workflow, but it blocks entirely invalid payloads or non-objects.

export async function getNewsletterProfiles() {
  await verifyAuth();
  return await newsletterProfileService.getAll();
}

export async function getNewsletterProfileById(id: string) {
  await verifyAuth();
  return await newsletterProfileService.getById(id);
}

export async function createNewsletterProfile(data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await newsletterProfileService.create(validData);
}

export async function updateNewsletterProfile(id: string, data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await newsletterProfileService.update(id, validData);
}

export async function deleteNewsletterProfile(id: string) {
  await verifyAuth();
  return await newsletterProfileService.delete(id);
}

export async function hideNewsletterProfile(id: string) {
  await verifyAuth();
  return await newsletterProfileService.hide(id);
}

export async function unhideNewsletterProfile(id: string) {
  await verifyAuth();
  return await newsletterProfileService.unhide(id);
}