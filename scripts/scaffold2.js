const fs = require('fs');
const path = require('path');

const entities = [
  { name: 'post', type: 'Post' },
  { name: 'fieldNote', type: 'FieldNote' },
  { name: 'thoughtFragment', type: 'ThoughtFragment' },
  { name: 'question', type: 'Question' },
  { name: 'journalMoment', type: 'JournalMoment' },
  { name: 'fragment', type: 'Fragment' },
  { name: 'builderStatus', type: 'BuilderStatus' },
  { name: 'activeSystem', type: 'ActiveSystem' },
  { name: 'buildLog', type: 'BuildLog' },
  { name: 'operatorFocus', type: 'OperatorFocus' },
  { name: 'redistributionRecord', type: 'RedistributionRecord' },
  { name: 'newsletterIssue', type: 'NewsletterIssue' },
  { name: 'newsletterProfile', type: 'NewsletterProfile' },
  { name: 'book', type: 'Book' }
];

const libDir = path.join(__dirname, 'lib');
const repoDir = path.join(libDir, 'repositories');
const serviceDir = path.join(libDir, 'services');

fs.mkdirSync(repoDir, { recursive: true });
fs.mkdirSync(serviceDir, { recursive: true });

// 1. Create a centralized mock database
const mockContent = 'import { Post, FieldNote, Question, ThoughtFragment, JournalMoment, Fragment, Book, BuilderStatus, ActiveSystem, BuildLog, OperatorFocus, RedistributionRecord, NewsletterIssue, NewsletterProfile } from "../types";\n\nexport const mockDatabase = {\n  posts: [] as Post[],\n  fieldNotes: [] as FieldNote[],\n  thoughtFragments: [] as ThoughtFragment[],\n  questions: [] as Question[],\n  journalMoments: [] as JournalMoment[],\n  fragments: [] as Fragment[],\n  books: [] as Book[],\n  builderStatuses: [] as BuilderStatus[],\n  activeSystems: [] as ActiveSystem[],\n  buildLogs: [] as BuildLog[],\n  operatorFocuses: [] as OperatorFocus[],\n  redistributionRecords: [] as RedistributionRecord[],\n  newsletterIssues: [] as NewsletterIssue[],\n  newsletterProfiles: [] as NewsletterProfile[],\n};\n';

fs.writeFileSync(path.join(repoDir, 'mockDatabase.ts'), mockContent);

entities.forEach(entity => {
  const collectionName = entity.name === 'builderStatus' ? 'builderStatuses' 
                        : entity.name === 'operatorFocus' ? 'operatorFocuses'
                        : entity.name + 's';
                        
  const repoContent = 'import { ' + entity.type + ' } from "../types";\nimport { mockDatabase } from "./mockDatabase";\n\nexport class ' + entity.type + 'Repository {\n  async getAll(): Promise<' + entity.type + '[]> {\n    return Promise.resolve(mockDatabase.' + collectionName + ');\n  }\n\n  async getById(id: string): Promise<' + entity.type + ' | null> {\n    const item = mockDatabase.' + collectionName + '.find((x: any) => x.id === id || x.persona === id);\n    return Promise.resolve(item || null);\n  }\n\n  async create(data: Omit<' + entity.type + ', "id">): Promise<' + entity.type + ' | null> {\n    // Basic mock implementation\n    const newItem = { id: Date.now().toString(), ...data } as unknown as ' + entity.type + ';\n    mockDatabase.' + collectionName + '.push(newItem);\n    return Promise.resolve(newItem);\n  }\n\n  async update(id: string, data: Partial<' + entity.type + '>): Promise<' + entity.type + ' | null> {\n    const index = mockDatabase.' + collectionName + '.findIndex((x: any) => x.id === id || x.persona === id);\n    if (index === -1) return Promise.resolve(null);\n    mockDatabase.' + collectionName + '[index] = { ...mockDatabase.' + collectionName + '[index], ...data };\n    return Promise.resolve(mockDatabase.' + collectionName + '[index]);\n  }\n\n  async delete(id: string): Promise<boolean> {\n    const index = mockDatabase.' + collectionName + '.findIndex((x: any) => x.id === id || x.persona === id);\n    if (index === -1) return Promise.resolve(false);\n    mockDatabase.' + collectionName + '.splice(index, 1);\n    return Promise.resolve(true);\n  }\n}\n';

  const serviceContent = 'import { ' + entity.type + ' } from "../types";\nimport { ' + entity.type + 'Repository } from "../repositories/' + entity.name + '.repository";\n\nexport class ' + entity.type + 'Service {\n  private repository: ' + entity.type + 'Repository;\n\n  constructor() {\n    this.repository = new ' + entity.type + 'Repository();\n  }\n\n  async getAll(): Promise<' + entity.type + '[]> {\n    try {\n      return await this.repository.getAll();\n    } catch (error) {\n      throw new Error("Failed to get ' + entity.name + 's");\n    }\n  }\n\n  async getById(id: string): Promise<' + entity.type + ' | null> {\n    try {\n      return await this.repository.getById(id);\n    } catch (error) {\n      throw new Error("Failed to get ' + entity.name + '");\n    }\n  }\n\n  async create(data: Omit<' + entity.type + ', "id">): Promise<' + entity.type + ' | null> {\n    try {\n      return await this.repository.create(data);\n    } catch (error) {\n      throw new Error("Failed to create ' + entity.name + '");\n    }\n  }\n\n  async update(id: string, data: Partial<' + entity.type + '>): Promise<' + entity.type + ' | null> {\n    try {\n      return await this.repository.update(id, data);\n    } catch (error) {\n      throw new Error("Failed to update ' + entity.name + '");\n    }\n  }\n\n  async delete(id: string): Promise<boolean> {\n    try {\n      return await this.repository.delete(id);\n    } catch (error) {\n      throw new Error("Failed to delete ' + entity.name + '");\n    }\n  }\n  \n  async hide(id: string): Promise<' + entity.type + ' | null> {\n    try {\n      return await this.repository.update(id, { hidden: true } as Partial<' + entity.type + '>);\n    } catch (error) {\n      throw new Error("Failed to hide ' + entity.name + '");\n    }\n  }\n\n  async unhide(id: string): Promise<' + entity.type + ' | null> {\n    try {\n      return await this.repository.update(id, { hidden: false } as Partial<' + entity.type + '>);\n    } catch (error) {\n      throw new Error("Failed to unhide ' + entity.name + '");\n    }\n  }\n}\n';

  fs.writeFileSync(path.join(repoDir, entity.name + '.repository.ts'), repoContent);
  fs.writeFileSync(path.join(serviceDir, entity.name + '.service.ts'), serviceContent);
});

console.log("Services and repositories generated.");
