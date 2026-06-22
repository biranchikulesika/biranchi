'use server';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth/verify';
import { OperatorFocusService } from '@/lib/services/operatorFocus.service';

const operatorFocusService = new OperatorFocusService();

// Define a basic Zod schema for payload validation
const payloadSchema = z.record(z.any());
// We keep it flexible to avoid breaking the UI workflow, but it blocks entirely invalid payloads or non-objects.

export async function getOperatorFocuss() {
  await verifyAuth();
  return await operatorFocusService.getAll();
}

export async function getOperatorFocusById(id: string) {
  await verifyAuth();
  return await operatorFocusService.getById(id);
}

export async function createOperatorFocus(data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await operatorFocusService.create(validData);
}

export async function updateOperatorFocus(id: string, data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await operatorFocusService.update(id, validData);
}

export async function deleteOperatorFocus(id: string) {
  await verifyAuth();
  return await operatorFocusService.delete(id);
}

export async function hideOperatorFocus(id: string) {
  await verifyAuth();
  return await operatorFocusService.hide(id);
}

export async function unhideOperatorFocus(id: string) {
  await verifyAuth();
  return await operatorFocusService.unhide(id);
}


export async function moveOperatorFocusUp(id: string) {
  await verifyAuth();
  return await operatorFocusService.moveUp(id);
}

export async function moveOperatorFocusDown(id: string) {
  await verifyAuth();
  return await operatorFocusService.moveDown(id);
}


export async function reorderOperatorFocuss(ids: string[]) {
  await verifyAuth();
  return await operatorFocusService.reorder(ids);
}