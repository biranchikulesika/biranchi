'use server';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth/verify';
import { RedistributionRecordService } from '@/lib/services/redistributionRecord.service';

const redistributionRecordService = new RedistributionRecordService();

// Define a basic Zod schema for payload validation
const payloadSchema = z.record(z.any());
// We keep it flexible to avoid breaking the UI workflow, but it blocks entirely invalid payloads or non-objects.

export async function getRedistributionRecords() {
  await verifyAuth();
  return await redistributionRecordService.getAll();
}

export async function getRedistributionRecordById(id: string) {
  await verifyAuth();
  return await redistributionRecordService.getById(id);
}

export async function createRedistributionRecord(data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await redistributionRecordService.create(validData);
}

export async function updateRedistributionRecord(id: string, data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await redistributionRecordService.update(id, validData);
}

export async function deleteRedistributionRecord(id: string) {
  await verifyAuth();
  return await redistributionRecordService.delete(id);
}

export async function hideRedistributionRecord(id: string) {
  await verifyAuth();
  return await redistributionRecordService.hide(id);
}

export async function unhideRedistributionRecord(id: string) {
  await verifyAuth();
  return await redistributionRecordService.unhide(id);
}