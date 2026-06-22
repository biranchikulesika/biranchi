'use server';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth/verify';
import { ActiveSystemService } from '@/lib/services/activeSystem.service';

const activeSystemService = new ActiveSystemService();

// Define a basic Zod schema for payload validation
const payloadSchema = z.record(z.any());
// We keep it flexible to avoid breaking the UI workflow, but it blocks entirely invalid payloads or non-objects.

export async function getActiveSystems() {
  await verifyAuth();
  return await activeSystemService.getAll();
}

export async function getActiveSystemById(id: string) {
  await verifyAuth();
  return await activeSystemService.getById(id);
}

export async function createActiveSystem(data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await activeSystemService.create(validData);
}

export async function updateActiveSystem(id: string, data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await activeSystemService.update(id, validData);
}

export async function deleteActiveSystem(id: string) {
  await verifyAuth();
  return await activeSystemService.delete(id);
}

export async function hideActiveSystem(id: string) {
  await verifyAuth();
  return await activeSystemService.hide(id);
}

export async function unhideActiveSystem(id: string) {
  await verifyAuth();
  return await activeSystemService.unhide(id);
}


export async function moveActiveSystemUp(id: string) {
  await verifyAuth();
  return await activeSystemService.moveUp(id);
}

export async function moveActiveSystemDown(id: string) {
  await verifyAuth();
  return await activeSystemService.moveDown(id);
}


export async function reorderActiveSystems(ids: string[]) {
  await verifyAuth();
  return await activeSystemService.reorder(ids);
}