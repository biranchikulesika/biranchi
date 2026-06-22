'use server';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth/verify';
import { subscriberService } from '@/lib/services/subscriber.service';

const payloadSchema = z.record(z.any());

export async function getSubscribers() {
  await verifyAuth();
  return await subscriberService.getAll();
}

export async function getSubscriber(id: string) {
  await verifyAuth();
  return await subscriberService.getById(id);
}

export async function saveSubscriber(id: string | null, data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  if (id) {
    return await subscriberService.update(id, validData);
  }
  return await subscriberService.create(validData);
}

export async function deleteSubscriber(id: string) {
  await verifyAuth();
  return await subscriberService.delete(id);
}