'use server';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth/verify';
import { ThoughtFragmentService } from '@/lib/services/thoughtFragment.service';

const thoughtFragmentService = new ThoughtFragmentService();

// Define a basic Zod schema for payload validation
const payloadSchema = z.record(z.any());
// We keep it flexible to avoid breaking the UI workflow, but it blocks entirely invalid payloads or non-objects.

export async function getThoughtFragments() {
  await verifyAuth();
  return await thoughtFragmentService.getAll();
}

export async function getThoughtFragmentById(id: string) {
  await verifyAuth();
  return await thoughtFragmentService.getById(id);
}

export async function createThoughtFragment(data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await thoughtFragmentService.create(validData);
}

export async function updateThoughtFragment(id: string, data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await thoughtFragmentService.update(id, validData);
}

export async function deleteThoughtFragment(id: string) {
  await verifyAuth();
  return await thoughtFragmentService.delete(id);
}

export async function hideThoughtFragment(id: string) {
  await verifyAuth();
  return await thoughtFragmentService.hide(id);
}

export async function unhideThoughtFragment(id: string) {
  await verifyAuth();
  return await thoughtFragmentService.unhide(id);
}


export async function moveThoughtFragmentUp(id: string) {
  await verifyAuth();
  return await thoughtFragmentService.moveUp(id);
}

export async function moveThoughtFragmentDown(id: string) {
  await verifyAuth();
  return await thoughtFragmentService.moveDown(id);
}