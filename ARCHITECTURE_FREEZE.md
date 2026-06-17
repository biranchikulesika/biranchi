# Architecture Freeze Document

## Post
- id: UUID
- persona: TEXT
- title: TEXT
- subtitle: TEXT (optional)
- slug: TEXT
- excerpt: TEXT (optional)
- coverImageUrl: TEXT (optional)
- coverImageAlt: TEXT (optional)
- coverImageCaption: TEXT (optional)
- coverImageLocation: TEXT (optional)
- coverImageCredit: TEXT (optional)
- autoCoverImage: BOOLEAN
- content: TEXT
- tags: TEXT[]
- readingTime: INTEGER (optional)
- publishedAt: TIMESTAMPTZ (optional)
- featured: BOOLEAN
- hidden: BOOLEAN
- draft: BOOLEAN
- createdAt: TIMESTAMPTZ
- updatedAt: TIMESTAMPTZ

## NewsletterIssue
- id: UUID
- persona: TEXT
- title: TEXT
- subject: TEXT (optional)
- previewText: TEXT (optional)
- content: TEXT (MDX format)
- publishedAt: TIMESTAMPTZ (optional)
- hidden: BOOLEAN
- createdAt: TIMESTAMPTZ
- updatedAt: TIMESTAMPTZ

## BuildLog
- id: UUID
- title: TEXT
- description: TEXT (optional)
- date: TEXT
- source: TEXT (manual | automated)
- aiGenerated: BOOLEAN
- generatedAt: TIMESTAMPTZ (optional)
- generationModel: TEXT (optional)
- relatedCommits: TEXT[]
- relatedRepositories: TEXT[]
- hidden: BOOLEAN
- createdAt: TIMESTAMPTZ
- updatedAt: TIMESTAMPTZ

## Subscriber
- id: UUID
- email: TEXT
- source: TEXT (optional)
- isVerified: BOOLEAN
- createdAt: TIMESTAMPTZ
- updatedAt: TIMESTAMPTZ

## RedistributionRecord
- id: UUID
- amount: NUMERIC
- destination: TEXT
- description: TEXT
- proofUrl: TEXT (optional)
- internalNotes: TEXT (optional)
- donatedAt: TIMESTAMPTZ
- transactionReference: TEXT (optional)
- createdAt: TIMESTAMPTZ
- updatedAt: TIMESTAMPTZ

## Authorization Strategy
Admin access will use Supabase Auth + Allowed Email List.
No custom users or roles table.

## Storage Buckets
Replace proposed buckets with:
- posts (posts/covers/, posts/content/)
- books (books/covers/)
- fund (fund/proofs/)
- shared (shared/miscellaneous/)
Filename strategy: [entity-id]-[timestamp].[ext]
