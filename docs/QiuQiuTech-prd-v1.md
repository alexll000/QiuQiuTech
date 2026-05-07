# QiuQiuTech Product Requirements Document V1

> Historical reference only. This document reflects an earlier product phase and should not override the latest brief or current route naming.

## 1. Executive Summary

### Problem Statement

Marketing industry users can browse many content sites, but they still lack a platform that combines timely discovery, structured contribution, and lightweight collaboration matching in one place.

### Proposed Solution

Build QiuQiuTech as a structured marketing platform with three linked systems:

- content aggregation
- submission and review workflow
- collaboration opportunity publishing and matching

### Success Criteria

- homepage content is updated continuously from multiple sources
- review workflow is manageable by a small operations team
- collaboration cards attract real contact requests
- monthly valid matches become the product north star

## 2. User Personas

### Persona A: Brand Marketer

Needs:

- industry updates
- campaign references
- collaboration discovery
- brand partnership exposure

### Persona B: Marketing Practitioner

Needs:

- capability exposure
- case publishing
- opportunity discovery
- peer connection

### Persona C: Contributor

Needs:

- structured publishing path
- clear review rules
- trusted platform exposure

### Persona D: Operator/Admin

Needs:

- efficient review queues
- controllable placements
- trackable source health
- manageable content quality

## 3. User Stories And Acceptance Criteria

### Story 1: Browse Content

As a visitor, I want to browse recent marketing content so that I can quickly understand what is happening in the industry.

Acceptance criteria:

- homepage displays mixed content modules
- content center supports filters
- content detail page shows source and structure clearly

### Story 2: Submit Structured Content

As a registered user, I want to submit a case or playbook in a structured format so that it can be reviewed and published consistently.

Acceptance criteria:

- user can choose a submission type
- system validates required fields and assets
- user can track submission status

### Story 3: Review And Publish

As an operator, I want to review captured or submitted content so that only qualified items reach the frontend.

Acceptance criteria:

- review queue supports approve/reject
- rejection reason is recorded
- placements can be assigned
- item can be published immediately or scheduled

### Story 4: Publish Opportunity

As a brand or marketer, I want to publish a collaboration opportunity so that I can find suitable partners.

Acceptance criteria:

- opportunity form supports structured fields
- visibility rule is configurable
- card appears in match center after approval

### Story 5: Request Contact

As a registered user, I want to request contact with a relevant opportunity owner so that I can start a collaboration discussion.

Acceptance criteria:

- request button exists on eligible cards
- request state is tracked
- platform can expose direct contact or mediate contact

## 4. Functional Scope

### 4.1 Content System

- scheduled source capture
- manual URL capture
- structured content mapping
- content status lifecycle
- content listing and detail rendering

### 4.2 Submission System

- type-based submission flows
- asset upload
- metadata tagging
- submission status tracking

### 4.3 Review System

- review queue
- item detail with side-by-side structured fields
- approval / rejection
- rejection templates
- publish scheduling
- archive / unpublish

### 4.4 Match System

- publish need or capability card
- match card review
- contact request flow
- basic status tracking

### 4.5 Admin System

- dashboard metrics
- placement control
- taxonomy management
- source management
- user management

## 5. Non-goals

- in-product direct messaging
- recruitment marketplace
- advanced recommendation engine
- organization hierarchy and permissions matrix
- paid subscription system in MVP

## 6. Data Objects

### ContentItem

- id
- type
- title
- summary
- cover
- body
- source_name
- source_url
- publish_time
- brand_name
- industry
- tags
- topic_ids
- status
- placement_flags

### Submission

- id
- submitter_id
- submission_type
- structured_fields
- asset_list
- current_status
- review_result
- review_notes

### ReviewTask

- id
- object_type
- object_id
- reviewer_id
- status
- action_log
- review_notes
- scheduled_publish_time

### MatchCard

- id
- publisher_id
- publisher_type
- target_partner_type
- collaboration_type
- industry
- region
- budget_range
- timeline
- description
- contact_policy
- status

### MatchRequest

- id
- match_card_id
- requester_id
- request_message
- status
- handoff_mode

## 7. Key Workflows

### Workflow A: Source Capture

1. system captures item from source or manual URL
2. parser maps fields
3. item enters pending review
4. operator edits and tags
5. item is published

### Workflow B: User Submission

1. user selects submission type
2. user fills structured form
3. system validates input
4. submission enters review queue
5. operator approves or rejects
6. approved item is published with placement

### Workflow C: Matchmaking

1. user publishes opportunity or capability
2. platform reviews card
3. card appears in connect center
4. another user requests contact
5. platform exposes contact or mediates handoff
6. request status is updated

## 8. Non-functional Requirements

### Performance

- homepage first screen target under 2.5 seconds on production-grade deployment
- list filters should feel responsive under common dataset sizes

### Security

- role-based admin access
- input sanitization
- upload safety checks
- rate limits on submissions and contact requests

### Traceability

- review actions must be logged
- source origin must be preserved
- published status changes must be auditable

### SEO

- server-rendered or statically generated detail pages
- metadata per content item and topic
- crawlable topic hubs

## 9. MVP Roadmap

### Phase 1

- finalize requirements
- define data fields
- create sitemap and page structures

### Phase 2

- build content pipeline
- build submission flow
- build review console

### Phase 3

- build match center
- build contact request flow
- build homepage modules and placements

### Phase 4

- internal QA
- soft launch
- first operational loop and KPI review

## 10. Risks

- source capture quality varies by site
- review load may spike if submissions are too open
- trust quality of opportunity cards can degrade without verification rules
- content value can become generic if editorial curation is too weak

## 11. Open Decisions

- exact stack for admin and CMS persistence
- source capture method per target site
- verification level for opportunity publishers
- search implementation depth in MVP
