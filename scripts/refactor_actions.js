import fs from 'fs';
import path from 'path';

const entities = [
  { name: 'post', capName: 'Post', file: 'posts', hasFeature: true },
  { name: 'fieldNote', capName: 'FieldNote', file: 'fieldNotes', hasFeature: true },
  { name: 'thoughtFragment', capName: 'ThoughtFragment', file: 'thoughtFragments', hasMove: true },
  { name: 'question', capName: 'Question', file: 'questions', hasMove: true, hasReorder: true },
  { name: 'journalMoment', capName: 'JournalMoment', file: 'journalMoments' },
  { name: 'fragment', capName: 'Fragment', file: 'fragments', hasMove: true },
  { name: 'builderStatus', capName: 'BuilderStatus', file: 'builderStatuses' },
  { name: 'activeSystem', capName: 'ActiveSystem', file: 'activeSystems', hasMove: true, hasReorder: true },
  { name: 'buildLog', capName: 'BuildLog', file: 'buildLogs' },
  { name: 'operatorFocus', capName: 'OperatorFocus', file: 'operatorFocuses', hasMove: true, hasReorder: true },
  { name: 'redistributionRecord', capName: 'RedistributionRecord', file: 'redistributionRecords' },
  { name: 'newsletterIssue', capName: 'NewsletterIssue', file: 'newsletterIssues' },
  { name: 'newsletterProfile', capName: 'NewsletterProfile', file: 'newsletterProfiles' },
  { name: 'book', capName: 'Book', file: 'books', hasFeature: true },
];

const template = (entity) => `
'use server';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth/verify';
import { ${entity.capName}Service } from '@/lib/services/${entity.name}.service';

const ${entity.name}Service = new ${entity.capName}Service();

// Define a basic Zod schema for payload validation
const payloadSchema = z.record(z.any());
// We keep it flexible to avoid breaking the UI workflow, but it blocks entirely invalid payloads or non-objects.

export async function get${entity.capName}s() {
  await verifyAuth();
  return await ${entity.name}Service.getAll();
}

export async function get${entity.capName}ById(id: string) {
  await verifyAuth();
  return await ${entity.name}Service.getById(id);
}

export async function create${entity.capName}(data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await ${entity.name}Service.create(validData);
}

export async function update${entity.capName}(id: string, data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await ${entity.name}Service.update(id, validData);
}

export async function delete${entity.capName}(id: string) {
  await verifyAuth();
  return await ${entity.name}Service.delete(id);
}

export async function hide${entity.capName}(id: string) {
  await verifyAuth();
  return await ${entity.name}Service.hide(id);
}

export async function unhide${entity.capName}(id: string) {
  await verifyAuth();
  return await ${entity.name}Service.unhide(id);
}
${entity.hasFeature ? `
export async function feature${entity.capName}(id: string) {
  await verifyAuth();
  return await ${entity.name}Service.feature(id);
}

export async function unfeature${entity.capName}(id: string) {
  await verifyAuth();
  return await ${entity.name}Service.unfeature(id);
}
` : ''}
${entity.hasMove ? `
export async function move${entity.capName}Up(id: string) {
  await verifyAuth();
  return await ${entity.name}Service.moveUp(id);
}

export async function move${entity.capName}Down(id: string) {
  await verifyAuth();
  return await ${entity.name}Service.moveDown(id);
}
` : ''}
${entity.hasReorder ? `
export async function reorder${entity.capName}s(ids: string[]) {
  await verifyAuth();
  return await ${entity.name}Service.reorder(ids);
}
` : ''}
`;

const dir = path.join(process.cwd(), 'app/admin/actions');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

entities.forEach(e => {
  fs.writeFileSync(path.join(dir, e.file + '.actions.ts'), template(e).trim());
});

const specialEntities = [
  { name: 'subscriber', file: 'subscribers' },
  { name: 'subscription', file: 'subscriptions' },
];

const specialTemplate = (entity) => `
'use server';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth/verify';
import { ${entity.name}Service } from '@/lib/services/${entity.name}.service';

const payloadSchema = z.record(z.any());

export async function get${entity.name.replace(/^./, (c) => c.toUpperCase())}s() {
  await verifyAuth();
  return await ${entity.name}Service.getAll();
}

export async function get${entity.name.replace(/^./, (c) => c.toUpperCase())}(id: string) {
  await verifyAuth();
  return await ${entity.name}Service.getById(id);
}

export async function save${entity.name.replace(/^./, (c) => c.toUpperCase())}(id: string | null, data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  if (id) {
    return await ${entity.name}Service.update(id, validData);
  }
  return await ${entity.name}Service.create(validData);
}

export async function delete${entity.name.replace(/^./, (c) => c.toUpperCase())}(id: string) {
  await verifyAuth();
  return await ${entity.name}Service.delete(id);
}
`;

specialEntities.forEach(e => {
  fs.writeFileSync(path.join(dir, e.file + '.actions.ts'), specialTemplate(e).trim());
});

console.log('Action files generated successfully!');
