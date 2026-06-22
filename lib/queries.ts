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

export async function getPosts() { return await new PostService().getAll(); }
export async function getPostBySlug(slug: string) { return await new PostService().getBySlug(slug); }
export async function getFragments() { return await new FragmentService().getAll(); }
export async function getJournalMoments() { return await new JournalMomentService().getAll(); }
export async function getBooks() { return await new BookService().getAll(); }
export async function getBuilderStatuss() { return await new BuilderStatusService().getAll(); }
export async function getActiveSystems() { return await new ActiveSystemService().getAll(); }
export async function getBuildLogs() { return await new BuildLogService().getAll(); }
export async function getRedistributionRecords() { return await new RedistributionRecordService().getAll(); }
export async function getNewsletterProfiles() { return await new NewsletterProfileService().getAll(); }
export async function getNewsletterIssues() { return await new NewsletterIssueService().getAll(); }
export async function getQuestions() { return await new QuestionService().getAll(); }
export async function getThoughtFragments() { return await new ThoughtFragmentService().getAll(); }
export async function getOperatorFocuss() { return await new OperatorFocusService().getAll(); }
