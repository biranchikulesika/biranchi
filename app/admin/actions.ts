'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signOut() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

import { getPosts as repoGetPosts, createPost as repoCreatePost } from '@/lib/repositories/post.repository'

// ============== Posts ==============
export async function getPosts() {
  return await repoGetPosts()
}
export async function createPost(input: any) {
  return await repoCreatePost(input)
}
export async function updatePost() {}
export async function deletePost() {}


// ============== Field Notes ==============
export async function getFieldNotes(): Promise<any[]> { return [] }
export async function createFieldNote() {}
export async function updateFieldNote() {}
export async function deleteFieldNote() {}
export async function hideFieldNote() {}
export async function unhideFieldNote() {}
export async function featureFieldNote() {}
export async function unfeatureFieldNote() {}

// ============== Questions ==============
export async function getQuestions(): Promise<any[]> { return [] }
export async function createQuestion() {}
export async function updateQuestion() {}
export async function deleteQuestion() {}
export async function moveQuestionUp() {}
export async function moveQuestionDown() {}
export async function hideQuestion() {}
export async function unhideQuestion() {}

// ============== Thought Fragments ==============
export async function getThoughtFragments(): Promise<any[]> { return [] }
export async function createThoughtFragment() {}
export async function updateThoughtFragment() {}
export async function deleteThoughtFragment() {}
export async function hideThoughtFragment() {}
export async function unhideThoughtFragment() {}
export async function moveThoughtFragmentUp() {}
export async function moveThoughtFragmentDown() {}

// ============== Journal Moments ==============
export async function getJournalMoments(): Promise<any[]> { return [] }
export async function createJournalMoment() {}
export async function updateJournalMoment() {}
export async function deleteJournalMoment() {}
export async function hideJournalMoment() {}
export async function unhideJournalMoment() {}

// ============== Fragments ==============
export async function getFragments(): Promise<any[]> { return [] }
export async function createFragment() {}
export async function updateFragment() {}
export async function deleteFragment() {}
export async function moveFragmentUp() {}
export async function moveFragmentDown() {}
export async function hideFragment() {}
export async function unhideFragment() {}

// ============== Books ==============
export async function getBooks(): Promise<any[]> { return [] }
export async function createBook() {}
export async function updateBook() {}
export async function deleteBook() {}
export async function hideBook() {}
export async function unhideBook() {}
export async function featureBook() {}
export async function unfeatureBook() {}

// ============== Builder Statuses ==============
export async function getBuilderStatuss(): Promise<any[]> { return [] }
export async function createBuilderStatus() {}
export async function updateBuilderStatus() {}
export async function deleteBuilderStatus() {}

// ============== Active Systems ==============
export async function getActiveSystems(): Promise<any[]> { return [] }
export async function createActiveSystem() {}
export async function updateActiveSystem() {}
export async function deleteActiveSystem() {}
export async function moveActiveSystemUp() {}
export async function moveActiveSystemDown() {}
export async function hideActiveSystem() {}
export async function unhideActiveSystem() {}

// ============== Build Logs ==============
export async function getBuildLogs(): Promise<any[]> { return [] }
export async function createBuildLog() {}
export async function updateBuildLog() {}
export async function deleteBuildLog() {}

// ============== Operator Focuses ==============
export async function getOperatorFocuss(): Promise<any[]> { return [] }
export async function createOperatorFocus() {}
export async function updateOperatorFocus() {}
export async function deleteOperatorFocus() {}
export async function moveOperatorFocusUp() {}
export async function moveOperatorFocusDown() {}

// ============== Redistribution Records ==============
export async function getRedistributionRecords(): Promise<any[]> { return [] }
export async function createRedistributionRecord() {}
export async function updateRedistributionRecord() {}
export async function deleteRedistributionRecord() {}

// ============== Newsletter Issues ==============
export async function getNewsletterIssues(): Promise<any[]> { return [] }
export async function createNewsletterIssue() {}
export async function updateNewsletterIssue() {}
export async function deleteNewsletterIssue() {}
export async function hideNewsletterIssue() {}
export async function unhideNewsletterIssue() {}

// ============== Newsletter Profiles ==============
export async function getNewsletterProfiles(): Promise<any[]> { return [] }
export async function createNewsletterProfile() {}
export async function updateNewsletterProfile() {}
export async function deleteNewsletterProfile() {}

// ============== Subscribers & Subscriptions ==============
export async function getSubscribers(): Promise<any[]> { return [] }
export async function getSubscriptions(): Promise<any[]> { return [] }
export async function saveSubscription() {}
