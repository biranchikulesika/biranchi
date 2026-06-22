'use server';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth/verify';
import { FragmentService } from '@/lib/services/fragment.service';

const fragmentService = new FragmentService();

// Define a basic Zod schema for payload validation
const payloadSchema = z.record(z.any());
// We keep it flexible to avoid breaking the UI workflow, but it blocks entirely invalid payloads or non-objects.

export async function getFragments() {
  await verifyAuth();
  return await fragmentService.getAll();
}

export async function getFragmentById(id: string) {
  await verifyAuth();
  return await fragmentService.getById(id);
}

export async function createFragment(data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await fragmentService.create(validData);
}

export async function updateFragment(id: string, data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await fragmentService.update(id, validData);
}

export async function deleteFragment(id: string) {
  await verifyAuth();
  return await fragmentService.delete(id);
}

export async function hideFragment(id: string) {
  await verifyAuth();
  return await fragmentService.hide(id);
}

export async function unhideFragment(id: string) {
  await verifyAuth();
  return await fragmentService.unhide(id);
}


export async function moveFragmentUp(id: string) {
  await verifyAuth();
  return await fragmentService.moveUp(id);
}

export async function moveFragmentDown(id: string) {
  await verifyAuth();
  return await fragmentService.moveDown(id);
}