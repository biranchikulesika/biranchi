'use server';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth/verify';
import { QuestionService } from '@/lib/services/question.service';

const questionService = new QuestionService();

// Define a basic Zod schema for payload validation
const payloadSchema = z.record(z.any());
// We keep it flexible to avoid breaking the UI workflow, but it blocks entirely invalid payloads or non-objects.

export async function getQuestions() {
  await verifyAuth();
  return await questionService.getAll();
}

export async function getQuestionById(id: string) {
  await verifyAuth();
  return await questionService.getById(id);
}

export async function createQuestion(data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await questionService.create(validData);
}

export async function updateQuestion(id: string, data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await questionService.update(id, validData);
}

export async function deleteQuestion(id: string) {
  await verifyAuth();
  return await questionService.delete(id);
}

export async function hideQuestion(id: string) {
  await verifyAuth();
  return await questionService.hide(id);
}

export async function unhideQuestion(id: string) {
  await verifyAuth();
  return await questionService.unhide(id);
}


export async function moveQuestionUp(id: string) {
  await verifyAuth();
  return await questionService.moveUp(id);
}

export async function moveQuestionDown(id: string) {
  await verifyAuth();
  return await questionService.moveDown(id);
}


export async function reorderQuestions(ids: string[]) {
  await verifyAuth();
  return await questionService.reorder(ids);
}