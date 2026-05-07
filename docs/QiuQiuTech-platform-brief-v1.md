# QiuQiuTech Website Platform Brief V1

> Historical reference only. This document belongs to an early planning phase and is no longer the current implementation truth.
> Current development should follow `QiuQiuTech_Full_Development_Brief_v2.md`, the root `README.md`, and the live code in `web/src/`.

## 1. Project Definition

**Project Name**: QiuQiuTech

**One-line Positioning**: A marketing industry platform that aggregates content, events, and playbooks, while enabling brand and marketer matchmaking.

**Product Nature**:

- Structured marketing content platform
- User submission and editorial publishing platform
- Light-weight collaboration and opportunity matching platform

QiuQiuTech is not intended to be:

- a pure editorial media site
- a heavy recruitment platform
- a full social networking product
- a complex enterprise CRM

## 2. Why This Product Exists

The market already has many content-led marketing sites. Most of them stop at "browse and read". QiuQiuTech needs a stronger product loop:

1. Aggregate useful marketing information
2. Lower content supply dependence on manual editing
3. Open a structured submission channel
4. Create real collaboration opportunities between brands and marketers

Its long-term moat is not content volume alone, but the combination of:

- content flow
- structured supply
- connection opportunities

## 3. Core Differentiation

### 3.1 Content + Connection

Unlike typical marketing content sites, QiuQiuTech should not end at display. It should help users discover relevant people, projects, and collaboration opportunities.

### 3.2 Three-source Content Supply

Content supply should come from three parallel sources:

- platform-operated content
- captured and structured external content
- user-submitted content

This reduces early-stage editorial pressure and improves freshness.

### 3.3 Structured Platform Instead of Open-ended Publishing

Users should not submit free-form content without constraints. Submission must be template-based so review, publishing, and content display remain consistent.

## 4. Target Users

### 4.1 Brand Teams

- brand marketing teams
- campaign owners
- content leads
- partnership managers

Needs:

- track marketing trends
- find references and inspiration
- publish partnership needs
- discover collaborators

### 4.2 Marketing Practitioners

- strategists
- creatives
- media specialists
- agency teams
- content operators

Needs:

- showcase work and capabilities
- gain exposure
- discover brand opportunities
- connect with peers

### 4.3 Contributors

- individuals
- teams
- brands
- agencies

Needs:

- submit structured cases or opportunities
- gain platform visibility
- use the platform as a distribution and credibility layer

### 4.4 Platform Operator

Needs:

- low-cost content operations
- manageable review flow
- controllable display positions
- measurable content and connection performance

## 5. Core Product Goals

### 5.1 Business Goals

- Build a sustainable content supply engine
- Establish a clear review and publishing system
- Run a lightweight matching loop between brands and marketers

### 5.2 Product Goals

- Keep homepage content fresh
- Make submission simple and reviewable
- Make collaboration cards trustworthy and structured
- Keep early-stage operations manageable for one operator

### 5.3 North Star Metric

**Monthly valid matches**: cases where two parties establish a real contact and move into active communication.

## 6. Product Scope

### 6.1 In Scope for MVP

- homepage
- content feed and detail pages
- structured content ingestion
- URL capture and source ingestion
- user submissions
- review workflow
- content placement management
- opportunity publishing
- contact request flow
- basic admin and analytics overview

### 6.2 Out of Scope for MVP

- recruitment
- direct messaging/chat
- complex membership monetization
- enterprise account hierarchy
- advanced recommendation algorithm
- full creator social graph

## 7. Content Model

QiuQiuTech should structure content into the following primary types:

- Industry News
- Marketing Case
- Marketing Event
- Playbook / Method
- Topic / Special
- Collaboration Opportunity

This object-based structure should drive:

- homepage module logic
- search and filters
- SEO page generation
- submission templates
- admin review rules

## 8. Core Modules

### 8.1 Content Aggregation

Support:

- scheduled source capture
- manual URL capture
- editorial enhancement after capture

Every captured item should map into platform fields:

- title
- summary
- cover
- source
- original URL
- publish time
- brand
- industry
- tags
- content type
- editor notes

### 8.2 User Submission

Users should be able to submit:

- case
- event
- playbook
- collaboration opportunity

Submissions must be structured rather than free-form.

### 8.3 Review and Publishing

Recommended state flow:

`draft -> pending review -> under review -> approved/rejected -> scheduled/published -> archived`

### 8.4 Matchmaking

Users should be able to:

- publish collaboration needs
- publish capability/resource cards
- apply for contact
- expose public or gated contact paths

This is a light-weight connection layer, not a full communication product.

## 9. Reference Product Learning

### bestla.cyzone.cn

Use as reference for:

- data indicators
- professional information framing
- industry overview modules

Do not copy its investor-company matching model directly.

### socialbeta.com

Use as reference for:

- clean editorial layout
- strong visual content blocks
- homepage hierarchy

Avoid its heavy dependence on manual editorial production.

### digitaling.com

Use as reference for:

- user submission entry
- publishing workflow concept

Avoid expanding into recruitment and broader heavy operations too early.

## 10. Product Definition Summary

QiuQiuTech should be defined as:

> A structured marketing industry platform that uses content aggregation as traffic entry, structured submissions as supply mechanism, and collaboration matching as differentiation.
