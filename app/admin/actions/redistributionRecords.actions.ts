'use server';
import { verifyAuth } from '@/lib/auth/verify';
import { RedistributionRecordService } from '@/lib/services/redistributionRecord.service';
import { redistributionRecordSchema } from '@/lib/schemas';

const redistributionRecordService = new RedistributionRecordService();

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
  const validData = redistributionRecordSchema.parse(data);
  return await redistributionRecordService.create(validData as any);
}

export async function updateRedistributionRecord(id: string, data: any) {
  await verifyAuth();
  const validData = redistributionRecordSchema.parse(data);
  return await redistributionRecordService.update(id, validData as any);
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