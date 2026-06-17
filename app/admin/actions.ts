'use server';
import { PostService } from '@/lib/services/post.service';
import { subscriberService } from '@/lib/services/subscriber.service';
import { subscriptionService } from '@/lib/services/subscription.service';

import { FieldNoteService } from '@/lib/services/fieldNote.service';
import { ThoughtFragmentService } from '@/lib/services/thoughtFragment.service';
import { QuestionService } from '@/lib/services/question.service';
import { JournalMomentService } from '@/lib/services/journalMoment.service';
import { FragmentService } from '@/lib/services/fragment.service';
import { BuilderStatusService } from '@/lib/services/builderStatus.service';
import { ActiveSystemService } from '@/lib/services/activeSystem.service';
import { BuildLogService } from '@/lib/services/buildLog.service';
import { OperatorFocusService } from '@/lib/services/operatorFocus.service';
import { RedistributionRecordService } from '@/lib/services/redistributionRecord.service';
import { NewsletterIssueService } from '@/lib/services/newsletterIssue.service';
import { NewsletterProfileService } from '@/lib/services/newsletterProfile.service';
import { BookService } from '@/lib/services/book.service';

const postService = new PostService();

export async function getPosts() {
  return await postService.getAll();
}

export async function getPostById(id: string) {
  return await postService.getById(id);
}

export async function createPost(data: any) {
  return await postService.create(data);
}

export async function updatePost(id: string, data: any) {
  return await postService.update(id, data);
}

export async function deletePost(id: string) {
  return await postService.delete(id);
}

export async function hidePost(id: string) {
  return await postService.hide(id);
}

export async function unhidePost(id: string) {
  return await postService.unhide(id);
}

export async function featurePost(id: string) {
  return await postService.feature(id);
}

export async function unfeaturePost(id: string) {
  return await postService.unfeature(id);
}

const fieldNoteService = new FieldNoteService();

export async function getFieldNotes() {
  return await fieldNoteService.getAll();
}

export async function getFieldNoteById(id: string) {
  return await fieldNoteService.getById(id);
}

export async function createFieldNote(data: any) {
  return await fieldNoteService.create(data);
}

export async function updateFieldNote(id: string, data: any) {
  return await fieldNoteService.update(id, data);
}

export async function deleteFieldNote(id: string) {
  return await fieldNoteService.delete(id);
}

export async function hideFieldNote(id: string) {
  return await fieldNoteService.hide(id);
}

export async function unhideFieldNote(id: string) {
  return await fieldNoteService.unhide(id);
}

export async function featureFieldNote(id: string) {
  return await fieldNoteService.feature(id);
}

export async function unfeatureFieldNote(id: string) {
  return await fieldNoteService.unfeature(id);
}

const thoughtFragmentService = new ThoughtFragmentService();

export async function getThoughtFragments() {
  return await thoughtFragmentService.getAll();
}

export async function getThoughtFragmentById(id: string) {
  return await thoughtFragmentService.getById(id);
}

export async function createThoughtFragment(data: any) {
  return await thoughtFragmentService.create(data);
}

export async function updateThoughtFragment(id: string, data: any) {
  return await thoughtFragmentService.update(id, data);
}

export async function deleteThoughtFragment(id: string) {
  return await thoughtFragmentService.delete(id);
}

export async function hideThoughtFragment(id: string) {
  return await thoughtFragmentService.hide(id);
}

export async function unhideThoughtFragment(id: string) {
  return await thoughtFragmentService.unhide(id);
}

const questionService = new QuestionService();

export async function getQuestions() {
  return await questionService.getAll();
}

export async function getQuestionById(id: string) {
  return await questionService.getById(id);
}

export async function createQuestion(data: any) {
  return await questionService.create(data);
}

export async function updateQuestion(id: string, data: any) {
  return await questionService.update(id, data);
}

export async function deleteQuestion(id: string) {
  return await questionService.delete(id);
}

export async function hideQuestion(id: string) {
  return await questionService.hide(id);
}

export async function unhideQuestion(id: string) {
  return await questionService.unhide(id);
}

export async function reorderQuestions(ids: string[]) {
  return await questionService.reorder(ids);
}

const journalMomentService = new JournalMomentService();

export async function getJournalMoments() {
  return await journalMomentService.getAll();
}

export async function getJournalMomentById(id: string) {
  return await journalMomentService.getById(id);
}

export async function createJournalMoment(data: any) {
  return await journalMomentService.create(data);
}

export async function updateJournalMoment(id: string, data: any) {
  return await journalMomentService.update(id, data);
}

export async function deleteJournalMoment(id: string) {
  return await journalMomentService.delete(id);
}

export async function hideJournalMoment(id: string) {
  return await journalMomentService.hide(id);
}

export async function unhideJournalMoment(id: string) {
  return await journalMomentService.unhide(id);
}

const fragmentService = new FragmentService();

export async function getFragments() {
  return await fragmentService.getAll();
}

export async function getFragmentById(id: string) {
  return await fragmentService.getById(id);
}

export async function createFragment(data: any) {
  return await fragmentService.create(data);
}

export async function updateFragment(id: string, data: any) {
  return await fragmentService.update(id, data);
}

export async function deleteFragment(id: string) {
  return await fragmentService.delete(id);
}

export async function hideFragment(id: string) {
  return await fragmentService.hide(id);
}

export async function unhideFragment(id: string) {
  return await fragmentService.unhide(id);
}

const builderStatusService = new BuilderStatusService();

export async function getBuilderStatuss() {
  return await builderStatusService.getAll();
}

export async function getBuilderStatusById(id: string) {
  return await builderStatusService.getById(id);
}

export async function createBuilderStatus(data: any) {
  return await builderStatusService.create(data);
}

export async function updateBuilderStatus(id: string, data: any) {
  return await builderStatusService.update(id, data);
}

export async function deleteBuilderStatus(id: string) {
  return await builderStatusService.delete(id);
}

export async function hideBuilderStatus(id: string) {
  return await builderStatusService.hide(id);
}

export async function unhideBuilderStatus(id: string) {
  return await builderStatusService.unhide(id);
}

const activeSystemService = new ActiveSystemService();

export async function getActiveSystems() {
  return await activeSystemService.getAll();
}

export async function getActiveSystemById(id: string) {
  return await activeSystemService.getById(id);
}

export async function createActiveSystem(data: any) {
  return await activeSystemService.create(data);
}

export async function updateActiveSystem(id: string, data: any) {
  return await activeSystemService.update(id, data);
}

export async function deleteActiveSystem(id: string) {
  return await activeSystemService.delete(id);
}

export async function hideActiveSystem(id: string) {
  return await activeSystemService.hide(id);
}

export async function unhideActiveSystem(id: string) {
  return await activeSystemService.unhide(id);
}

export async function reorderActiveSystems(ids: string[]) {
  return await activeSystemService.reorder(ids);
}

const buildLogService = new BuildLogService();

export async function getBuildLogs() {
  return await buildLogService.getAll();
}

export async function getBuildLogById(id: string) {
  return await buildLogService.getById(id);
}

export async function createBuildLog(data: any) {
  return await buildLogService.create(data);
}

export async function updateBuildLog(id: string, data: any) {
  return await buildLogService.update(id, data);
}

export async function deleteBuildLog(id: string) {
  return await buildLogService.delete(id);
}

export async function hideBuildLog(id: string) {
  return await buildLogService.hide(id);
}

export async function unhideBuildLog(id: string) {
  return await buildLogService.unhide(id);
}

const operatorFocusService = new OperatorFocusService();

export async function getOperatorFocuss() {
  return await operatorFocusService.getAll();
}

export async function getOperatorFocusById(id: string) {
  return await operatorFocusService.getById(id);
}

export async function createOperatorFocus(data: any) {
  return await operatorFocusService.create(data);
}

export async function updateOperatorFocus(id: string, data: any) {
  return await operatorFocusService.update(id, data);
}

export async function deleteOperatorFocus(id: string) {
  return await operatorFocusService.delete(id);
}

export async function hideOperatorFocus(id: string) {
  return await operatorFocusService.hide(id);
}

export async function unhideOperatorFocus(id: string) {
  return await operatorFocusService.unhide(id);
}

export async function reorderOperatorFocuss(ids: string[]) {
  return await operatorFocusService.reorder(ids);
}

const redistributionRecordService = new RedistributionRecordService();

export async function getRedistributionRecords() {
  return await redistributionRecordService.getAll();
}

export async function getRedistributionRecordById(id: string) {
  return await redistributionRecordService.getById(id);
}

export async function createRedistributionRecord(data: any) {
  return await redistributionRecordService.create(data);
}

export async function updateRedistributionRecord(id: string, data: any) {
  return await redistributionRecordService.update(id, data);
}

export async function deleteRedistributionRecord(id: string) {
  return await redistributionRecordService.delete(id);
}

export async function hideRedistributionRecord(id: string) {
  return await redistributionRecordService.hide(id);
}

export async function unhideRedistributionRecord(id: string) {
  return await redistributionRecordService.unhide(id);
}

const newsletterIssueService = new NewsletterIssueService();

export async function getNewsletterIssues() {
  return await newsletterIssueService.getAll();
}

export async function getNewsletterIssueById(id: string) {
  return await newsletterIssueService.getById(id);
}

export async function createNewsletterIssue(data: any) {
  return await newsletterIssueService.create(data);
}

export async function updateNewsletterIssue(id: string, data: any) {
  return await newsletterIssueService.update(id, data);
}

export async function deleteNewsletterIssue(id: string) {
  return await newsletterIssueService.delete(id);
}

export async function hideNewsletterIssue(id: string) {
  return await newsletterIssueService.hide(id);
}

export async function unhideNewsletterIssue(id: string) {
  return await newsletterIssueService.unhide(id);
}

const newsletterProfileService = new NewsletterProfileService();

export async function getNewsletterProfiles() {
  return await newsletterProfileService.getAll();
}

export async function getNewsletterProfileById(id: string) {
  return await newsletterProfileService.getById(id);
}

export async function createNewsletterProfile(data: any) {
  return await newsletterProfileService.create(data);
}

export async function updateNewsletterProfile(id: string, data: any) {
  return await newsletterProfileService.update(id, data);
}

export async function deleteNewsletterProfile(id: string) {
  return await newsletterProfileService.delete(id);
}

export async function hideNewsletterProfile(id: string) {
  return await newsletterProfileService.hide(id);
}

export async function unhideNewsletterProfile(id: string) {
  return await newsletterProfileService.unhide(id);
}

const bookService = new BookService();

export async function getBooks() {
  return await bookService.getAll();
}

export async function getBookById(id: string) {
  return await bookService.getById(id);
}

export async function createBook(data: any) {
  return await bookService.create(data);
}

export async function updateBook(id: string, data: any) {
  return await bookService.update(id, data);
}

export async function deleteBook(id: string) {
  return await bookService.delete(id);
}

export async function hideBook(id: string) {
  return await bookService.hide(id);
}

export async function unhideBook(id: string) {
  return await bookService.unhide(id);
}

export async function featureBook(id: string) {
  return await bookService.feature(id);
}

export async function unfeatureBook(id: string) {
  return await bookService.unfeature(id);
}



// ADDED REORDER ACTIONS
export async function moveActiveSystemUp(id: string) { return await activeSystemService.moveUp(id); }
export async function moveActiveSystemDown(id: string) { return await activeSystemService.moveDown(id); }

export async function moveQuestionUp(id: string) { return await questionService.moveUp(id); }
export async function moveQuestionDown(id: string) { return await questionService.moveDown(id); }

export async function moveThoughtFragmentUp(id: string) { return await thoughtFragmentService.moveUp(id); }
export async function moveThoughtFragmentDown(id: string) { return await thoughtFragmentService.moveDown(id); }

export async function moveFragmentUp(id: string) { return await fragmentService.moveUp(id); }
export async function moveFragmentDown(id: string) { return await fragmentService.moveDown(id); }

export async function moveOperatorFocusUp(id: string) { return await operatorFocusService.moveUp(id); }
export async function moveOperatorFocusDown(id: string) { return await operatorFocusService.moveDown(id); }



// SUBSCRIBER ACTIONS
export async function getSubscribers() { return await subscriberService.getAll(); }
export async function getSubscriber(id: string) { return await subscriberService.getById(id); }
export async function saveSubscriber(id: string | null, data: any) {
  if (id) return await subscriberService.update(id, data);
  return await subscriberService.create(data);
}
export async function deleteSubscriber(id: string) { return await subscriberService.delete(id); }

// SUBSCRIPTION ACTIONS
export async function getSubscriptions() { return await subscriptionService.getAll(); }
export async function getSubscription(id: string) { return await subscriptionService.getById(id); }
export async function saveSubscription(id: string | null, data: any) {
  if (id) return await subscriptionService.update(id, data);
  return await subscriptionService.create(data);
}
export async function deleteSubscription(id: string) { return await subscriptionService.delete(id); }
