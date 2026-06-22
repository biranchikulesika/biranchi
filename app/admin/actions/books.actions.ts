'use server';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth/verify';
import { BookService } from '@/lib/services/book.service';

const bookService = new BookService();

// Define a basic Zod schema for payload validation
const payloadSchema = z.record(z.any());
// We keep it flexible to avoid breaking the UI workflow, but it blocks entirely invalid payloads or non-objects.

export async function getBooks() {
  await verifyAuth();
  return await bookService.getAll();
}

export async function getBookById(id: string) {
  await verifyAuth();
  return await bookService.getById(id);
}

export async function createBook(data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await bookService.create(validData);
}

export async function updateBook(id: string, data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await bookService.update(id, validData);
}

export async function deleteBook(id: string) {
  await verifyAuth();
  return await bookService.delete(id);
}

export async function hideBook(id: string) {
  await verifyAuth();
  return await bookService.hide(id);
}

export async function unhideBook(id: string) {
  await verifyAuth();
  return await bookService.unhide(id);
}

export async function featureBook(id: string) {
  await verifyAuth();
  return await bookService.feature(id);
}

export async function unfeatureBook(id: string) {
  await verifyAuth();
  return await bookService.unfeature(id);
}