'use server';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth/verify';
import { BuildLogService } from '@/lib/services/buildLog.service';

const buildLogService = new BuildLogService();

// Define a basic Zod schema for payload validation
const payloadSchema = z.record(z.any());
// We keep it flexible to avoid breaking the UI workflow, but it blocks entirely invalid payloads or non-objects.

export async function getBuildLogs() {
  await verifyAuth();
  return await buildLogService.getAll();
}

export async function getBuildLogById(id: string) {
  await verifyAuth();
  return await buildLogService.getById(id);
}

export async function createBuildLog(data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await buildLogService.create(validData);
}

export async function updateBuildLog(id: string, data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await buildLogService.update(id, validData);
}

export async function deleteBuildLog(id: string) {
  await verifyAuth();
  return await buildLogService.delete(id);
}

export async function hideBuildLog(id: string) {
  await verifyAuth();
  return await buildLogService.hide(id);
}

export async function unhideBuildLog(id: string) {
  await verifyAuth();
  return await buildLogService.unhide(id);
}