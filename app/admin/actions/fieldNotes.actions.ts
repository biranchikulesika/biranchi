'use server';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth/verify';
import { FieldNoteService } from '@/lib/services/fieldNote.service';

const fieldNoteService = new FieldNoteService();

// Define a basic Zod schema for payload validation
const payloadSchema = z.record(z.any());
// We keep it flexible to avoid breaking the UI workflow, but it blocks entirely invalid payloads or non-objects.

export async function getFieldNotes() {
  await verifyAuth();
  return await fieldNoteService.getAll();
}

export async function getFieldNoteById(id: string) {
  await verifyAuth();
  return await fieldNoteService.getById(id);
}

export async function createFieldNote(data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await fieldNoteService.create(validData);
}

export async function updateFieldNote(id: string, data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await fieldNoteService.update(id, validData);
}

export async function deleteFieldNote(id: string) {
  await verifyAuth();
  return await fieldNoteService.delete(id);
}

export async function hideFieldNote(id: string) {
  await verifyAuth();
  return await fieldNoteService.hide(id);
}

export async function unhideFieldNote(id: string) {
  await verifyAuth();
  return await fieldNoteService.unhide(id);
}

export async function featureFieldNote(id: string) {
  await verifyAuth();
  return await fieldNoteService.feature(id);
}

export async function unfeatureFieldNote(id: string) {
  await verifyAuth();
  return await fieldNoteService.unfeature(id);
}