import fs from 'fs';
import path from 'path';

function getAllFiles(dirPath, filesConfig) {
  const files = fs.readdirSync(dirPath);

  filesConfig = filesConfig || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      filesConfig = getAllFiles(dirPath + "/" + file, filesConfig)
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        filesConfig.push(path.join(dirPath, "/", file))
      }
    }
  });

  return filesConfig;
}

const map = {
  // Posts
  'getPosts': 'posts',
  'getPostById': 'posts',
  'createPost': 'posts',
  'updatePost': 'posts',
  'deletePost': 'posts',
  'hidePost': 'posts',
  'unhidePost': 'posts',
  'featurePost': 'posts',
  'unfeaturePost': 'posts',

  // FieldNotes
  'getFieldNotes': 'fieldNotes',
  'getFieldNoteById': 'fieldNotes',
  'createFieldNote': 'fieldNotes',
  'updateFieldNote': 'fieldNotes',
  'deleteFieldNote': 'fieldNotes',
  'hideFieldNote': 'fieldNotes',
  'unhideFieldNote': 'fieldNotes',
  'featureFieldNote': 'fieldNotes',
  'unfeatureFieldNote': 'fieldNotes',

  // ThoughtFragments
  'getThoughtFragments': 'thoughtFragments',
  'getThoughtFragmentById': 'thoughtFragments',
  'createThoughtFragment': 'thoughtFragments',
  'updateThoughtFragment': 'thoughtFragments',
  'deleteThoughtFragment': 'thoughtFragments',
  'hideThoughtFragment': 'thoughtFragments',
  'unhideThoughtFragment': 'thoughtFragments',
  'moveThoughtFragmentUp': 'thoughtFragments',
  'moveThoughtFragmentDown': 'thoughtFragments',

  // Questions
  'getQuestions': 'questions',
  'getQuestionById': 'questions',
  'createQuestion': 'questions',
  'updateQuestion': 'questions',
  'deleteQuestion': 'questions',
  'hideQuestion': 'questions',
  'unhideQuestion': 'questions',
  'moveQuestionUp': 'questions',
  'moveQuestionDown': 'questions',
  'reorderQuestions': 'questions',

  // JournalMoments
  'getJournalMoments': 'journalMoments',
  'getJournalMomentById': 'journalMoments',
  'createJournalMoment': 'journalMoments',
  'updateJournalMoment': 'journalMoments',
  'deleteJournalMoment': 'journalMoments',
  'hideJournalMoment': 'journalMoments',
  'unhideJournalMoment': 'journalMoments',

  // Fragments
  'getFragments': 'fragments',
  'getFragmentById': 'fragments',
  'createFragment': 'fragments',
  'updateFragment': 'fragments',
  'deleteFragment': 'fragments',
  'hideFragment': 'fragments',
  'unhideFragment': 'fragments',
  'moveFragmentUp': 'fragments',
  'moveFragmentDown': 'fragments',

  // BuilderStatuses
  'getBuilderStatuss': 'builderStatuses',
  'getBuilderStatusById': 'builderStatuses',
  'createBuilderStatus': 'builderStatuses',
  'updateBuilderStatus': 'builderStatuses',
  'deleteBuilderStatus': 'builderStatuses',
  'hideBuilderStatus': 'builderStatuses',
  'unhideBuilderStatus': 'builderStatuses',

  // ActiveSystems
  'getActiveSystems': 'activeSystems',
  'getActiveSystemById': 'activeSystems',
  'createActiveSystem': 'activeSystems',
  'updateActiveSystem': 'activeSystems',
  'deleteActiveSystem': 'activeSystems',
  'hideActiveSystem': 'activeSystems',
  'unhideActiveSystem': 'activeSystems',
  'moveActiveSystemUp': 'activeSystems',
  'moveActiveSystemDown': 'activeSystems',
  'reorderActiveSystems': 'activeSystems',

  // BuildLogs
  'getBuildLogs': 'buildLogs',
  'getBuildLogById': 'buildLogs',
  'createBuildLog': 'buildLogs',
  'updateBuildLog': 'buildLogs',
  'deleteBuildLog': 'buildLogs',
  'hideBuildLog': 'buildLogs',
  'unhideBuildLog': 'buildLogs',

  // OperatorFocuses
  'getOperatorFocuss': 'operatorFocuses',
  'getOperatorFocusById': 'operatorFocuses',
  'createOperatorFocus': 'operatorFocuses',
  'updateOperatorFocus': 'operatorFocuses',
  'deleteOperatorFocus': 'operatorFocuses',
  'hideOperatorFocus': 'operatorFocuses',
  'unhideOperatorFocus': 'operatorFocuses',
  'moveOperatorFocusUp': 'operatorFocuses',
  'moveOperatorFocusDown': 'operatorFocuses',
  'reorderOperatorFocuss': 'operatorFocuses',

  // RedistributionRecords
  'getRedistributionRecords': 'redistributionRecords',
  'getRedistributionRecordById': 'redistributionRecords',
  'createRedistributionRecord': 'redistributionRecords',
  'updateRedistributionRecord': 'redistributionRecords',
  'deleteRedistributionRecord': 'redistributionRecords',
  'hideRedistributionRecord': 'redistributionRecords',
  'unhideRedistributionRecord': 'redistributionRecords',

  // NewsletterIssues
  'getNewsletterIssues': 'newsletterIssues',
  'getNewsletterIssueById': 'newsletterIssues',
  'createNewsletterIssue': 'newsletterIssues',
  'updateNewsletterIssue': 'newsletterIssues',
  'deleteNewsletterIssue': 'newsletterIssues',
  'hideNewsletterIssue': 'newsletterIssues',
  'unhideNewsletterIssue': 'newsletterIssues',

  // NewsletterProfiles
  'getNewsletterProfiles': 'newsletterProfiles',
  'getNewsletterProfileById': 'newsletterProfiles',
  'createNewsletterProfile': 'newsletterProfiles',
  'updateNewsletterProfile': 'newsletterProfiles',
  'deleteNewsletterProfile': 'newsletterProfiles',
  'hideNewsletterProfile': 'newsletterProfiles',
  'unhideNewsletterProfile': 'newsletterProfiles',

  // Books
  'getBooks': 'books',
  'getBookById': 'books',
  'createBook': 'books',
  'updateBook': 'books',
  'deleteBook': 'books',
  'hideBook': 'books',
  'unhideBook': 'books',
  'featureBook': 'books',
  'unfeatureBook': 'books',

  // Subscribers
  'getSubscribers': 'subscribers',
  'getSubscriber': 'subscribers',
  'saveSubscriber': 'subscribers',
  'deleteSubscriber': 'subscribers',

  // Subscriptions
  'getSubscriptions': 'subscriptions',
  'getSubscription': 'subscriptions',
  'saveSubscription': 'subscriptions',
  'deleteSubscription': 'subscriptions',
};

const adminDir = path.join(process.cwd(), 'app');
const filesToProcess = getAllFiles(adminDir);

filesToProcess.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const importRegex = /import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]@\/app\/admin\/actions(\.ts)?['"]/g;

  let changed = false;
  let newContent = content.replace(importRegex, (match, importsStr) => {
    changed = true;
    const imports = importsStr.split(',').map(i => i.trim()).filter(i => i);
    const domainImports = {};

    imports.forEach(i => {
      const aliasMatch = i.split(' as ');
      const name = aliasMatch[0].trim();
      const domain = map[name] || 'unknown';
      if (!domainImports[domain]) domainImports[domain] = [];
      domainImports[domain].push(i);
    });

    const lines = [];
    for (const domain in domainImports) {
      if (domain === 'unknown') {
        lines.push("import { " + domainImports[domain].join(', ') + " } from '@/app/admin/actions';");
      } else {
        lines.push("import { " + domainImports[domain].join(', ') + " } from '@/app/admin/actions/" + domain + ".actions';");
      }
    }
    return lines.join('\\n');
  });

  if (changed) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated imports in', file);
  }
});
