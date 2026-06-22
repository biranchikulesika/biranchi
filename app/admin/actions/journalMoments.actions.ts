'use server';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth/verify';
import { JournalMomentService } from '@/lib/services/journalMoment.service';

const journalMomentService = new JournalMomentService();

// Define a basic Zod schema for payload validation
const payloadSchema = z.record(z.any());
// We keep it flexible to avoid breaking the UI workflow, but it blocks entirely invalid payloads or non-objects.

export async function getJournalMoments() {
  await verifyAuth();
  return await journalMomentService.getAll();
}

export async function getJournalMomentById(id: string) {
  await verifyAuth();
  return await journalMomentService.getById(id);
}

export async function createJournalMoment(data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await journalMomentService.create(validData);
}

export async function updateJournalMoment(id: string, data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await journalMomentService.update(id, validData);
}

export async function deleteJournalMoment(id: string) {
  await verifyAuth();
  return await journalMomentService.delete(id);
}

export async function hideJournalMoment(id: string) {
  await verifyAuth();
  return await journalMomentService.hide(id);
}

export async function unhideJournalMoment(id: string) {
  await verifyAuth();
  return await journalMomentService.unhide(id);
}