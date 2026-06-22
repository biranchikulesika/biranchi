'use server';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth/verify';
import { BuilderStatusService } from '@/lib/services/builderStatus.service';

const builderStatusService = new BuilderStatusService();

// Define a basic Zod schema for payload validation
const payloadSchema = z.record(z.any());
// We keep it flexible to avoid breaking the UI workflow, but it blocks entirely invalid payloads or non-objects.

export async function getBuilderStatuss() {
  await verifyAuth();
  return await builderStatusService.getAll();
}

export async function getBuilderStatusById(id: string) {
  await verifyAuth();
  return await builderStatusService.getById(id);
}

export async function createBuilderStatus(data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await builderStatusService.create(validData);
}

export async function updateBuilderStatus(id: string, data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await builderStatusService.update(id, validData);
}

export async function deleteBuilderStatus(id: string) {
  await verifyAuth();
  return await builderStatusService.delete(id);
}

export async function hideBuilderStatus(id: string) {
  await verifyAuth();
  return await builderStatusService.hide(id);
}

export async function unhideBuilderStatus(id: string) {
  await verifyAuth();
  return await builderStatusService.unhide(id);
}