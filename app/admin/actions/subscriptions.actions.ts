'use server';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth/verify';
import { subscriptionService } from '@/lib/services/subscription.service';

const payloadSchema = z.record(z.any());

export async function getSubscriptions() {
  await verifyAuth();
  return await subscriptionService.getAll();
}

export async function getSubscription(id: string) {
  await verifyAuth();
  return await subscriptionService.getById(id);
}

export async function saveSubscription(id: string | null, data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  if (id) {
    return await subscriptionService.update(id, validData);
  }
  return await subscriptionService.create(validData);
}

export async function deleteSubscription(id: string) {
  await verifyAuth();
  return await subscriptionService.delete(id);
}