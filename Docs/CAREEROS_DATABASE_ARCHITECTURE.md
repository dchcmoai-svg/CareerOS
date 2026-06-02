# CareerOS PostgreSQL Architecture

> The complete data model for CareerOS, organized into 5 layers: Operational, Professional Graph, Intelligence, Vector, and MCP/Agent layers.

---

## Overview

CareerOS data is organized into **5 layers**, each serving a distinct purpose:

```
┌─────────────────────────────────────────────────────┐
│ LAYER 5: MCP / AGENT LAYER                          │
│ (ToolInvocation, AgentExecution, AgentMemory)       │
└─────────────────────────────────────────────────────┘
                         ↑
┌─────────────────────────────────────────────────────┐
│ LAYER 4: VECTOR LAYER (pgvector)                    │
│ (ProfileEmbedding, JobEmbedding, CompanyEmbedding)  │
└─────────────────────────────────────────────────────┘
                         ↑
┌─────────────────────────────────────────────────────┐
│ LAYER 3: INTELLIGENCE LAYER                         │
│ (MatchResult, Recommendation, MarketSignal,         │
│  VisibilityScore, RecruiterSearch, JobProfile)      │
└─────────────────────────────────────────────────────┘
                         ↑
┌─────────────────────────────────────────────────────┐
│ LAYER 2: PROFESSIONAL GRAPH                         │
│ (Skills, Projects, Achievements, Certifications,    │
│  Experiences, Education, Publications, Patents)     │
└─────────────────────────────────────────────────────┘
                         ↑
┌─────────────────────────────────────────────────────┐
│ LAYER 1: OPERATIONAL DATABASE                       │
│ (Users, Jobs, Companies, Applications, Interviews,  │
│  Offers, Notifications, Subscriptions)              │
└─────────────────────────────────────────────────────┘
```

---

## Layer 1: Operational Database

The **system of record** for CareerOS platform operations.

### Core Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `auth_user` | Platform users | id, username, email, password_hash |
| `scraper_job` | Job opportunities | id, title, company, url, description, salary, work_mode, remote_type |
| `scraper_company` | Company data | id, name, industry, size, stage, location |
| `core_trackeritem` | User's job applications | id, user_id, job_id, stage, ats_score |
| `core_resumevariant` | Resume versions | id, user_id, branch_name, target_role, content_json |
| (Future) `applications` | Application records | id, user_id, job_id, status, applied_at |
| (Future) `interviews` | Interview records | id, application_id, date, round_number |
| (Future) `offers` | Job offers | id, application_id, salary, start_date |
| (Future) `notifications` | User notifications | id, user_id, type, message, read_at |
| (Future) `subscriptions` | Subscription data | id, user_id, plan, status, expires_at |

### Characteristics

- **Normalize transactional data** — avoid duplication
- **Index on queries** — users, jobs, applications
- **Audit trail** — created_at, updated_at timestamps
- **Immutable** — once recorded, business events don't change

---

## Layer 2: Professional Graph

**Enriches** the operational layer with detailed professional identity and portable career equity.

### Extended Identity Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `core_professionalidentity` | Core profile | user_id, inferred_seniority, primary_industry |
| `core_skill` | Skills | identity_id, name, inferred_from, is_verified |
| `core_experience` | Work history | identity_id, company, title, start_date, end_date, seniority_level |
| `core_education` | Degrees & courses | identity_id, institution, degree, field_of_study |
| `core_project` | Personal projects | identity_id, title, description, url, skills_involved, impact |
| `core_achievement` | Accomplishments | identity_id, title, description, date, category |
| `core_certification` | Credentials | identity_id, name, issuer, credential_id, issue_date |
| `core_award` | Recognition | identity_id, title, issuer, date |
| `core_publication` | Papers, articles | identity_id, title, publisher, publication_date, url |
| `core_patent` | Patents filed | identity_id, title, patent_number, filing_date, issue_date |
| `core_volunteerwork` | Volunteer experience | identity_id, organization, position, start_date, end_date |
| `core_speakingengagement` | Speaking gigs | identity_id, title, event, event_date, url |

### Characteristics

- **Connected to ProfessionalIdentity** — all via foreign key
- **Portable** — can export & import across platforms
- **Time-stamped** — track career progression over time
- **Linked to Skills** — projects and experiences reference skills
- **Supports narrative** — descriptions explain the "why" behind accomplishments

### Data Model Diagram

```
ProfessionalIdentity (user)
    ├── Skill (name, verified)
    ├── Experience (company, title, seniority_level)
    ├── Education (degree, institution)
    ├── Project (title, impact, skills_involved)
    ├── Achievement (title, accomplishment)
    ├── Certification (name, issuer, credential_id)
    ├── Award (title, issuer)
    ├── Publication (title, publisher, url)
    ├── Patent (title, patent_number)
    ├── VolunteerWork (organization, position)
    └── SpeakingEngagement (title, event)
```

---

## Layer 3: Intelligence Layer

**Reasoning layer**: How jobs match profiles, what to recommend, market trends.

### Job Intelligence

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `core_jobprofile` | Structured job understanding | job_id, seniority_level, work_mode, visa_support, salary_band_min/max, extracted_skills |

**Example:**
- Raw Job: "Sr. Software Engineer @ Stripe"
- JobProfile: seniority="Senior", work_mode="Remote", visa_support=true, salary_band=180k-250k, extracted_skills=["Python", "Rust", "gRPC"]

### Matching Engine

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `core_matchresult` | Job-to-profile match | profile_id, job_id, resume_variant_id, overall_score, skill_match_score, experience_match_score, salary_alignment_score, location_match_score, resume_relevance_score, recommendation_level |

**Example:**
- Profile: "Mid-level Python engineer in SF"
- Job: "Sr. Engineer @ NYC fintech"
- MatchResult: overall_score=72, skill_match=85, experience_match=70, salary_alignment=60, location_match=45, recommendation_level="yes"

### Recommendations

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `core_recommendation` | Why a job is good | profile_id, job_id, reason, priority, score, tags |

**Examples:**
- "91% match on React & TypeScript skills"
- "Company is hiring 5+ similar roles (fast-moving)"
- "Remote-first, matches your preference"
- "Salary aligns with your target range"

### Market Intelligence

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `core_marketsignal` | Skill/region demand | skill, region, demand_score, salary_trend, growth_rate, data_points |

**Example:**
- Skill: "Rust"
- Region: "US-SF"
- demand_score: 87 (very hot)
- salary_trend: +12 (salaries rising)
- growth_rate: 45% (jobs growing)

### Recruiter Intelligence

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `core_visibilityscore` | Profile visibility to recruiters | profile_id, profile_completeness, activity_score, recruiter_engagement_score, overall_visibility, is_searchable, open_to_opportunities |
| `core_recruitersearch` | Recruiter contact/search events | profile_id, recruiter_name, recruiter_company, search_query, contact_method, interest_level |

**Example:**
- VisibilityScore: overall_visibility=78 (searchable by recruiters)
- RecruiterSearch: Google recruiter searched for "Senior Python Engineer, Bay Area" → found your profile

---

## Layer 4: Vector Layer (pgvector)

**Semantic embeddings** stored in PostgreSQL with pgvector extension.

### Setup (PostgreSQL only)

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Tables

| Table | Purpose | Embedding Dims | Key Fields |
|-------|---------|---|-----------|
| `core_profileembedding` | Professional profile as vector | 1536 | profile_id, embedding (VECTOR), embedding_model |
| `core_jobembedding` | Job description as vector | 1536 | job_id, embedding (VECTOR), embedding_model |
| `core_companyembedding` | Company profile as vector | 1536 | company_name, embedding (VECTOR), company_metadata |

### Indexes

```sql
CREATE INDEX ON core_profileembedding USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX ON core_jobembedding USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX ON core_companyembedding USING ivfflat (embedding vector_cosine_ops);
```

### Example Query (Semantic Search)

```python
# Find jobs similar to a candidate's profile
similar_jobs = JobEmbedding.objects.raw("""
    SELECT * FROM core_jobembedding
    ORDER BY embedding <=> %s
    LIMIT 10
""", [profile_embedding.embedding])
```

### Example Query (Similarity Matching)

```python
# Find the best jobs for a profile using vector similarity
from django.db.models import F
from pgvector.django import L2Distance

similar_jobs = JobEmbedding.objects.annotate(
    distance=L2Distance("embedding", profile_embedding.embedding)
).order_by("distance")[:20]
```

---

## Layer 5: MCP / Agent Layer

**AI agent execution** and memory for autonomous task completion.

### Tool Invocation

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `core_toolinvocation` | Single tool call | profile_id, tool_name, tool_input, tool_output, status, error_message, execution_time_ms |

**Example:**
- tool_name: "search_jobs"
- tool_input: {"keywords": "Python", "remote": true, "limit": 10}
- tool_output: [{"job_id": 123, "title": "...", "match_score": 0.89}, ...]
- status: "success"

### Agent Execution

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `core_agentexecution` | Complete agent session | profile_id, agent_name, task_description, status, tool_invocations (M2M), result_json, execution_time_ms |

**Example:**
- agent_name: "JobSearchAgent"
- task_description: "Find top 5 jobs matching my profile and expertise"
- tool_invocations: [search_jobs, filter_by_salary, rank_by_match, ...]
- result_json: {"top_jobs": [...], "summary": "Found 5 excellent matches"}

### Agent Memory

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `core_agentmemory` | Persistent agent context | profile_id, agent_name, memory_key, memory_value, relevance_score |

**Examples:**
- agent_name: "JobSearchAgent", memory_key: "preferred_companies", memory_value: ["Google", "Stripe", "Figma"]
- agent_name: "ResumeOptimizer", memory_key: "user_feedback", memory_value: {"preferred_tone": "bold", "avoid_phrases": [...]}

---

## Relationships & Cardinality

### Central Entity: ProfessionalIdentity

```
User (1) ──→ (1) ProfessionalIdentity
                    ├── (1..n) Skill
                    ├── (1..n) Experience
                    ├── (1..n) Education
                    ├── (1..n) Project
                    ├── (1..n) Achievement
                    ├── (1..n) Certification
                    ├── (1..n) Award
                    ├── (1..n) Publication
                    ├── (1..n) Patent
                    ├── (1..n) VolunteerWork
                    ├── (1..n) SpeakingEngagement
                    ├── (1..n) MatchResult → Job
                    ├── (1..n) Recommendation → Job
                    ├── (1) VisibilityScore
                    ├── (1..n) RecruiterSearch
                    ├── (1) ProfileEmbedding
                    ├── (1..n) ToolInvocation
                    ├── (1..n) AgentExecution
                    └── (1..n) AgentMemory
```

### Job-Centric Relationships

```
Job (1)
  ├── (1) JobProfile
  ├── (1) JobEmbedding
  ├── (1..n) MatchResult ← ProfessionalIdentity
  └── (1..n) Recommendation ← ProfessionalIdentity
```

---

## Migration Path

### Step 1: Create All Models

```bash
python manage.py makemigrations core
python manage.py migrate core
```

### Step 2: Add pgvector to PostgreSQL (Production Only)

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Step 3: Create Indexes for Performance

```sql
-- Profile search
CREATE INDEX idx_skill_identity ON core_skill(identity_id);
CREATE INDEX idx_experience_identity ON core_experience(identity_id);
CREATE INDEX idx_matchresult_profile_job ON core_matchresult(profile_id, job_id);
CREATE INDEX idx_recommendation_profile ON core_recommendation(profile_id);

-- Vector similarity search (requires pgvector)
CREATE INDEX ON core_profileembedding USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX ON core_jobembedding USING ivfflat (embedding vector_cosine_ops);
```

### Step 4: Backfill Data

```python
# Create ProfileEmbedding for existing identities
from core.models import ProfessionalIdentity, ProfileEmbedding

for identity in ProfessionalIdentity.objects.all():
    ProfileEmbedding.objects.get_or_create(profile=identity)
```

---

## Design Principles

### 1. Layered Architecture

- **Separation of concerns** — each layer has a single purpose
- **Composable** — layers can be used independently
- **Scalable** — add new layers without breaking existing ones

### 2. ProfessionalIdentity as Center

All intelligence radiates from a single professional profile:

```
ProfessionalIdentity
    ├── What I am (Skills, Experience)
    ├── What I've done (Projects, Achievements)
    ├── What I'm worth (Education, Certifications)
    ├── What I want (Preferences, VisibilityScore)
    ├── What matches (MatchResult, Recommendation)
    └── What's possible (AgentMemory, ToolInvocation)
```

### 3. Semantic + Structured

- **Structured fields** — seniority_level, work_mode, visa_support (for filtering/ranking)
- **Semantic fields** — embeddings (for similarity + context understanding)
- **Flexible fields** — JSONField for rich context (reasoning, metadata)

### 4. Audit Trail

All tables include:
- `created_at` — when record was created
- `updated_at` — when record was last modified
- `user_id` or `profile_id` — who owns it

### 5. Immutable Events

Core events (applications, interviews, offers) are immutable — use status to track state.

---

## Example Queries

### Find top jobs for a profile

```python
from core.models import MatchResult

top_jobs = MatchResult.objects.filter(
    profile=user_profile,
    recommendation_level__in=["strong_yes", "yes"]
).order_by("-overall_score")[:20]
```

### Get market demand for a skill

```python
from core.models import MarketSignal

signal = MarketSignal.objects.get(
    skill="Python",
    region="US-SF"
)
print(f"Demand: {signal.demand_score}/100")
print(f"Salary trend: {signal.salary_trend:+.1f}%")
```

### Track recruiter interest

```python
from core.models import RecruiterSearch

recent_searches = RecruiterSearch.objects.filter(
    profile=user_profile
).order_by("-created_at")[:10]

hot_companies = (recent_searches
    .values("recruiter_company")
    .annotate(interest=Avg("interest_level"))
    .order_by("-interest"))
```

### Run an agent to find jobs

```python
from core.models import AgentExecution

execution = AgentExecution.objects.create(
    profile=user_profile,
    agent_name="JobSearchAgent",
    task_description="Find top 5 jobs for my profile"
)

# Agent will:
# 1. Invoke search_jobs tool
# 2. Store results in ToolInvocation
# 3. Update AgentExecution.result_json
# 4. Save to AgentMemory for next run
```

---

## Future Enhancements

### 1. Operational Layer Completion

- [ ] `Application` table (replace TrackerItem)
- [ ] `Interview` table (structured interview data)
- [ ] `Offer` table (job offers)
- [ ] `Notification` table (user notifications)

### 2. Vector Layer Enhancements

- [ ] Multi-embedding models (OpenAI, Anthropic, local)
- [ ] Embedding versioning (track model updates)
- [ ] Cached similarity scores (MatchResult.embedding_similarity)

### 3. Intelligence Layer Expansion

- [ ] `CompanyMatch` — how well does a company match user preferences?
- [ ] `SkillGapAnalysis` — what skills needed to reach next level?
- [ ] `CareerPathRecommendation` — suggested next moves

### 4. Analytics

- [ ] User funnel tracking (discovery → application → offer)
- [ ] Market trends dashboard
- [ ] Agent performance tracking

---

## Summary Table

| Layer | Tables | Purpose | Key Insight |
|-------|--------|---------|------------|
| **1: Operational** | users, jobs, applications, ... | Run the platform | System of record |
| **2: Professional Graph** | skills, experiences, projects, ... | Understand the user | Portable equity |
| **3: Intelligence** | match_results, recommendations, ... | Reason about fit | Actionable insights |
| **4: Vector** | profile_embeddings, job_embeddings | Semantic search | AI-native search |
| **5: MCP/Agent** | agent_execution, tool_invocation | Autonomous reasoning | Future of CareerOS |

---

## Notes for Developers

### When Using SQLite

- Embeddings are stored as JSON arrays
- Vector similarity queries run in Python, not SQL
- `use_for_development_only = True`

### When Using PostgreSQL + pgvector

- Create the pgvector extension
- Embeddings stored as VECTOR(1536)
- Similarity queries run in SQL (fast)
- Indexes with ivfflat algorithm

### Adding New Entities

1. Create model inheriting from `models.Model`
2. Add `created_at` and `updated_at` fields
3. Link to `ProfessionalIdentity` if applicable
4. Add to appropriate layer docstring
5. Create migration: `python manage.py makemigrations core`

