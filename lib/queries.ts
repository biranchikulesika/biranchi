import { PostService } from '@/lib/services/post.service';
import { FragmentService } from '@/lib/services/fragment.service';
import { JournalMomentService } from '@/lib/services/journalMoment.service';
import { BookService } from '@/lib/services/book.service';
import { BuilderStatusService } from '@/lib/services/builderStatus.service';
import { ActiveSystemService } from '@/lib/services/activeSystem.service';
import { BuildLogService } from '@/lib/services/buildLog.service';
import { RedistributionRecordService } from '@/lib/services/redistributionRecord.service';
import { NewsletterProfileService } from '@/lib/services/newsletterProfile.service';
import { NewsletterIssueService } from '@/lib/services/newsletterIssue.service';
import { QuestionService } from '@/lib/services/question.service';
import { ThoughtFragmentService } from '@/lib/services/thoughtFragment.service';
import { OperatorFocusService } from '@/lib/services/operatorFocus.service';

const safeArray = async (fn: () => Promise<any>) => { try { return await fn() || []; } catch (e) { console.error("Query failed", e); return []; } };
const safeSingle = async (fn: () => Promise<any>) => { try { return await fn() || null; } catch (e) { console.error("Query failed", e); return null; } };

export async function getPosts(searchQuery?: string) { return safeArray(() => new PostService().getAll(searchQuery)); }
export async function getPostsMeta(searchQuery?: string) { return safeArray(() => new PostService().getAllMeta(searchQuery)); }
export async function getPostBySlug(slug: string, persona?: string) { return safeSingle(() => new PostService().getBySlug(slug, persona)); }
export async function getFragments() { return safeArray(() => new FragmentService().getAll()); }
export async function getJournalMoments() { return safeArray(() => new JournalMomentService().getAll()); }
export async function getBooks() { return safeArray(() => new BookService().getAll()); }
export async function getBuilderStatuss() { return safeArray(() => new BuilderStatusService().getAll()); }
export async function getActiveSystems() { return safeArray(() => new ActiveSystemService().getAll()); }
export async function getBuildLogs() { return safeArray(() => new BuildLogService().getAll()); }
export async function getRedistributionRecords() { return safeArray(() => new RedistributionRecordService().getAll()); }
export async function getNewsletterProfiles() { return safeArray(() => new NewsletterProfileService().getAll()); }
export async function getNewsletterIssues() { return safeArray(() => new NewsletterIssueService().getAll()); }
export async function getQuestions() { return safeArray(() => new QuestionService().getAll()); }
export async function getThoughtFragments() { return safeArray(() => new ThoughtFragmentService().getAll()); }
export async function getOperatorFocuss() { return safeArray(() => new OperatorFocusService().getAll()); }
