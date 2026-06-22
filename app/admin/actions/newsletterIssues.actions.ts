'use server';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth/verify';
import { NewsletterIssueService } from '@/lib/services/newsletterIssue.service';

const newsletterIssueService = new NewsletterIssueService();

// Define a basic Zod schema for payload validation
const payloadSchema = z.record(z.any());
// We keep it flexible to avoid breaking the UI workflow, but it blocks entirely invalid payloads or non-objects.

export async function getNewsletterIssues() {
  await verifyAuth();
  return await newsletterIssueService.getAll();
}

export async function getNewsletterIssueById(id: string) {
  await verifyAuth();
  return await newsletterIssueService.getById(id);
}

export async function createNewsletterIssue(data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await newsletterIssueService.create(validData);
}

export async function updateNewsletterIssue(id: string, data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await newsletterIssueService.update(id, validData);
}

export async function deleteNewsletterIssue(id: string) {
  await verifyAuth();
  return await newsletterIssueService.delete(id);
}

export async function hideNewsletterIssue(id: string) {
  await verifyAuth();
  return await newsletterIssueService.hide(id);
}

export async function unhideNewsletterIssue(id: string) {
  await verifyAuth();
  return await newsletterIssueService.unhide(id);
}