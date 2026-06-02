# CareerOS: From Claude-Centric to Platform Architecture

**Vision Document**  
**Status:** Strategic Architecture for Q3 2026+  
**Author:** CareerOS Team  

---

## 🎯 The Core Problem

The ai-job-search repo demonstrates a critical architectural flaw:

```
Current (ai-job-search):
User → Claude Code → Claude API → Claude's Tools → Application

Risk Vectors:
❌ Claude price increase       → Entire platform becomes expensive
❌ Claude API outage           → Zero uptime
❌ Claude changes model        → Entire pipeline breaks
❌ Claude rate limits          → System stalls
❌ Claude sunsetting           → Migration nightmare
❌ Vendor lock-in at every layer

Result: CareerOS becomes a thin Claude wrapper, not a platform.
```

---

## ✨ The Solution: Career Intelligence Platform

```
Desired (CareerOS):
User → CareerOS CLI → CareerOS Agent Runtime → Model Router → LLMs (Claude, GPT-4, Qwen, etc.)
                  ↓
           CareerOS MCP Server
                  ↓
        CareerOS Tools & Services
                  ↓
        Professional Graph (Core Data)

Benefits:
✅ Any LLM can plug in               (Claude, GPT-4, Gemini, etc.)
✅ Agents own domains (not monolithic)
✅ Tools are model-agnostic
✅ Professional Graph is authoritative source
✅ MCP enables infinite integrations
✅ Platform scales independent of model vendor
```

---

## 📐 Proposed Architecture Layers

### Layer 1: Professional Graph (Core Data)

**Current ai-job-search has:**
- Flat profile files (CLAUDE.md, 01-candidate-profile.md, etc.)
- No relationships
- No temporal tracking

**CareerOS should have:**

```python
class ProfessionalGraph:
    """
    The single source of truth for career data.
    All agents read/write to this graph.
    """
    
    def __init__(self):
        self.nodes = {
            "identity": {...},
            "skills": {...},
            "experiences": {...},
            "projects": {...},
            "achievements": {...},
            "education": {...},
            "certifications": {...},
            "career_goals": {...},
            "preferences": {...},
        }
        
        self.relationships = {
            # skill ← used_in → experience
            # experience ← achieved → achievement
            # project ← demonstrates → skill
            # achievement ← requires → skill
            # goal ← needs → skill
        }
        
        self.temporal = {
            # Track: when skill was acquired, when it was used
            # Track: when preferences changed
            # Track: job applications and outcomes
        }
    
    def get_skill_history(self, skill_id: str) -> SkillTimeline:
        """When was this skill acquired? Used? Where?"""
        
    def get_achievement_evidence(self, achievement_id: str) -> List[Evidence]:
        """What projects/experiences prove this achievement?"""
        
    def get_role_fit(self, skill_requirements: List[str]) -> FitAnalysis:
        """Do we have these skills? At what level? With what evidence?"""
        
    def suggest_positioning(self, target_role: str) -> PositioningStrategy:
        """How should we reposition existing experience for this role?"""
```

**Why this matters:**
- Resume Agent can query: "Show me all times I used Python with significant impact"
- ATS Agent can query: "Do we have verifiable evidence for these keywords?"
- Application Agent can query: "What achievements best match this role?"
- Interview Agent can query: "What are strong STAR examples for this skill?"

---

### Layer 2: CareerOS Services

**Domain-specific services that manage the Professional Graph:**

```python
# careeros/services/

class SkillService:
    """Manage skills, skill levels, proficiency, acquisition."""
    
    def extract_skills_from_resume(self, resume: str) -> List[Skill]:
        """Parse resume → structured skills"""
        
    def enrich_skill(self, skill_id: str, context: str):
        """Add details: level, evidence, categories"""
        
    def get_skill_trajectory(self, skill_id: str) -> Timeline:
        """Show progression of a skill over career"""


class ExperienceService:
    """Manage work history, projects, achievements."""
    
    def parse_job_description(self, job_desc: str) -> Job:
        """Extract company, title, duration, responsibilities"""
        
    def link_achievements(self, experience_id: str, achievements: List[str]):
        """Connect achievements to this role"""
        
    def get_transferable_skills(self, experience_id: str) -> SkillMapping:
        """What skills from this role apply to target roles?"""


class ResearchService:
    """Gather market intelligence, salary data, company info."""
    
    def research_company(self, company_name: str) -> CompanyProfile:
        """Company size, culture, tech stack, recent news"""
        
    def research_role(self, role_title: str, company: str) -> RoleInsights:
        """What skills are hot for this role? Salary range? Growth?"""
        
    def research_market(self, skill: str, location: str) -> MarketInsights:
        """How in-demand is this skill? Salary trends?"""


class AtsService:
    """Analyze job postings against profile."""
    
    def extract_keywords(self, job_posting: str) -> KeywordAnalysis:
        """Required, preferred, nice-to-have keywords"""
        
    def calculate_match_score(self, job_id: str) -> MatchScore:
        """Skill overlap, experience match, culture fit"""
        
    def suggest_positioning(self, job_id: str) -> PositioningAdvice:
        """How to reframe our background for this role"""


class ApplicationService:
    """Manage application state and history."""
    
    def create_application_packet(
        self, 
        job_id: str, 
        candidate_profile: str
    ) -> ApplicationPacket:
        """Generate all components for this application"""
        
    def track_application(self, app_id: str) -> ApplicationTimeline:
        """Status, follow-ups, feedback"""
        
    def extract_feedback(self, rejection_email: str) -> RejectionInsights:
        """Why did we get rejected? What to improve?"""
```

**Service Layer Benefits:**
- Each service is testable independently
- Services can be called by different agents
- Business logic is decoupled from LLM calls
- Easy to swap implementations or data sources

---

### Layer 3: Model Router

**Instead of:** "Use Claude for everything"  
**Use:** "Use the right model for each task"

```python
# careeros/routing/model_router.py

class ModelRouter:
    """
    Route tasks to optimal models based on requirements.
    """
    
    MODELS = {
        "extraction": "qwen-2b",           # Fast, cheap, good parsing
        "skill_analysis": "bge-large",     # Semantic similarity
        "ats_scoring": "gpt-4o",           # Structured output, accuracy
        "deep_reasoning": "claude-3.5-sonnet",  # Complex logic
        "apply": "claude-3.5-sonnet",      # Best for writing
        "followup": "claude-3.5-sonnet",   # Nuance
    }
    
    def route(self, task: Task) -> Model:
        """Select model for this task."""
        
        if task.type == "extract_resume":
            return self.MODELS["extraction"]  # Fast + cheap
        
        elif task.type == "analyze_fit":
            return self.MODELS["ats_scoring"]  # Accuracy matters
        
        elif task.type == "draft_cover_letter":
            return self.MODELS["apply"]  # Quality matters
        
        elif task.type == "review_application":
            return self.MODELS["deep_reasoning"]  # Complex feedback
        
        else:
            return self.MODELS["deep_reasoning"]  # Default: Claude
    
    def calculate_cost(self, task: Task) -> float:
        """Estimate token cost for this task."""
        
    def get_alternatives(self, model: Model) -> List[Model]:
        """If primary model fails/unavailable, what's next?"""


# Example: Using the router
router = ModelRouter()

# Extraction: Use fast Qwen model
extraction_model = router.route(Task("extract_resume"))
skills = extraction_model.call(resume_text, prompt="extract skills")

# ATS Scoring: Use GPT-4o for structured output
scoring_model = router.route(Task("ats_score"))
score = scoring_model.call(job_posting, profile, prompt="score this fit")

# Cover Letter: Use Claude for quality
writing_model = router.route(Task("draft_cover_letter"))
letter = writing_model.call(profile, job, prompt="write cover letter")
```

**Model Selection Criteria:**

| Task | Model | Why |
|------|-------|-----|
| Resume parsing | Qwen 2B | Fast, cheap, good enough |
| Skill extraction | BGE-large | Semantic similarity, embeddings |
| ATS scoring | GPT-4o | Structured JSON, reliability |
| Fit analysis | Claude | Deep reasoning, nuance |
| Cover letter drafting | Claude | Quality writing |
| Autonomous apply | Claude + GPT-4 | Mix reasoning + execution |
| Interview prep | Claude | Complex reasoning about STAR |
| Recruiter outreach | GPT-4o | Personalization + structure |

**Cost optimization:**
```
Original (all Claude): 3M tokens × $0.015/1K = $45/year

Optimized routing:
- Extraction (Qwen):      2M tokens × $0.0002/1K = $0.40
- ATS (GPT-4o):          500K tokens × $0.003/1K = $1.50
- Reasoning (Claude):    500K tokens × $0.015/1K = $7.50
                                              Total = $9.40/year

Result: 4.8x cost reduction while improving quality
```

---

### Layer 4: CareerOS Agents

**Instead of:** One super-agent doing everything  
**Use:** Specialized agents, each owning a domain

```python
# careeros/agents/

from langchain.agents import AgentExecutor
from careeros.tools import CareerOSToolkit

class ResumeAgent:
    """Manage resume creation, variants, and optimization."""
    
    def __init__(self):
        self.tools = [
            "query_professional_graph",
            "extract_achievements",
            "suggest_positioning",
            "generate_resume_variant",
            "analyze_ats_keywords",
        ]
    
    async def create_resume_variant(self, target_role: str) -> Resume:
        """
        1. Query Professional Graph for relevant achievements
        2. Analyze target role requirements (via ATS Agent)
        3. Reposition experience to match keywords
        4. Generate LaTeX → PDF
        5. Verify layout
        """
        pass


class ATSAgent:
    """Analyze job postings and suggest positioning."""
    
    def __init__(self):
        self.tools = [
            "extract_job_keywords",
            "calculate_match_score",
            "research_role",
            "suggest_skills_to_highlight",
        ]
    
    async def analyze_posting(self, job_posting: str) -> JobAnalysis:
        """
        1. Extract keywords (required, preferred, nice-to-have)
        2. Calculate match against candidate profile
        3. Identify skill gaps
        4. Suggest how to reframe existing skills
        """
        pass


class ReviewerAgent:
    """Critique applications and suggest improvements."""
    
    def __init__(self):
        self.tools = [
            "research_company",
            "analyze_writing_quality",
            "check_keyword_coverage",
            "verify_claims",
        ]
    
    async def review_application(
        self,
        resume: str,
        cover_letter: str,
        job_posting: str
    ) -> ReviewFeedback:
        """
        1. Research company culture and priorities
        2. Check for missed keywords
        3. Critique tone and positioning
        4. Verify all claims against profile
        5. Suggest targeted edits
        """
        pass


class ApplicationAgent:
    """Orchestrate application creation and submission."""
    
    def __init__(self):
        self.tools = [
            "create_application_packet",
            "track_application",
            "queue_application",
            "submit_application",
            "schedule_followup",
        ]
    
    async def apply_to_job(self, job_id: str) -> ApplicationResult:
        """
        1. Create Application Packet (via Resume + Review agents)
        2. Get human approval
        3. Submit to job board
        4. Track status
        5. Schedule follow-up
        """
        pass


class CoordinatorAgent:
    """High-level orchestration and decision making."""
    
    def __init__(self):
        self.agents = {
            "resume": ResumeAgent(),
            "ats": ATSAgent(),
            "reviewer": ReviewerAgent(),
            "application": ApplicationAgent(),
        }
    
    async def coordinate_application(self, job_url: str):
        """
        1. ATS Agent analyzes job posting
        2. Resume Agent creates variant
        3. Reviewer Agent critiques
        4. Resume Agent revises
        5. Application Agent submits
        """
        
        # Analyze
        job = await self.agents["ats"].analyze_posting(job_url)
        
        # Draft
        resume = await self.agents["resume"].create_resume_variant(job.role)
        
        # Review
        feedback = await self.agents["reviewer"].review_application(
            resume, cover_letter, job_url
        )
        
        # Revise
        resume = await self.agents["resume"].apply_feedback(resume, feedback)
        
        # Submit
        result = await self.agents["application"].apply_to_job(job_id)
        
        return result
```

**Agent Benefits:**
- Each agent is independently debuggable
- Agents can run in parallel (ATS + Resume on same job)
- Easy to add new agents (Interview Agent, Negotiation Agent, etc.)
- Agents can be swapped (use Claude for resume, GPT for ATS)
- Testable and measurable

---

### Layer 5: CareerOS MCP Server

**The API layer that makes CareerOS composable:**

```python
# careeros/mcp_server.py

from mcp.server import Server
from mcp.tools import Tool

class CareerOSMCP(Server):
    """
    Model Context Protocol server exposing CareerOS as tools.
    Any Claude, Cursor, Anthropic Workbench can connect.
    """
    
    def __init__(self):
        super().__init__("CareerOS")
        self._register_tools()
    
    def _register_tools(self):
        """Expose all CareerOS capabilities as MCP tools."""
        
        # Resume Intelligence Tools
        self.register_tool(
            name="parse_resume",
            description="Parse resume into structured data",
            handler=self._parse_resume,
            input_schema={
                "type": "object",
                "properties": {
                    "resume_text": {"type": "string"},
                    "format": {"type": "string", "enum": ["pdf", "docx", "text"]},
                },
                "required": ["resume_text"],
            }
        )
        
        self.register_tool(
            name="extract_skills",
            description="Extract and enrich skills from resume",
            handler=self._extract_skills,
            input_schema={
                "type": "object",
                "properties": {
                    "resume_id": {"type": "string"},
                },
                "required": ["resume_id"],
            }
        )
        
        # Job Matching Tools
        self.register_tool(
            name="analyze_job_posting",
            description="Extract keywords and requirements from job posting",
            handler=self._analyze_job_posting,
            input_schema={
                "type": "object",
                "properties": {
                    "job_posting": {"type": "string"},
                    "company": {"type": "string", "description": "Optional company name for research"},
                },
                "required": ["job_posting"],
            }
        )
        
        self.register_tool(
            name="calculate_match_score",
            description="Calculate fit score between candidate and job",
            handler=self._calculate_match_score,
            input_schema={
                "type": "object",
                "properties": {
                    "candidate_id": {"type": "string"},
                    "job_id": {"type": "string"},
                },
                "required": ["candidate_id", "job_id"],
            }
        )
        
        # Application Packet Tools
        self.register_tool(
            name="create_application_packet",
            description="Generate all components for job application",
            handler=self._create_application_packet,
            input_schema={
                "type": "object",
                "properties": {
                    "job_id": {"type": "string"},
                    "candidate_id": {"type": "string"},
                    "include_components": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "resume, cover_letter, fit_analysis, company_research"
                    },
                },
                "required": ["job_id", "candidate_id"],
            }
        )
        
        # Application Tracking Tools
        self.register_tool(
            name="queue_application",
            description="Queue an application for human review",
            handler=self._queue_application,
            input_schema={
                "type": "object",
                "properties": {
                    "packet_id": {"type": "string"},
                    "priority": {"type": "string", "enum": ["high", "normal", "low"]},
                },
                "required": ["packet_id"],
            }
        )
        
        self.register_tool(
            name="submit_application",
            description="Submit application to job board",
            handler=self._submit_application,
            input_schema={
                "type": "object",
                "properties": {
                    "packet_id": {"type": "string"},
                    "auto_followup": {"type": "boolean"},
                },
                "required": ["packet_id"],
            }
        )
        
        # Market Intelligence Tools
        self.register_tool(
            name="get_market_insights",
            description="Get salary, demand, and trend data for a skill/role",
            handler=self._get_market_insights,
            input_schema={
                "type": "object",
                "properties": {
                    "query": {"type": "string"},
                    "location": {"type": "string", "description": "Optional: filter by location"},
                },
                "required": ["query"],
            }
        )
    
    # Handler implementations
    async def _parse_resume(self, resume_text: str, **kwargs) -> dict:
        """Parse resume → Professional Graph"""
        pass
    
    async def _extract_skills(self, resume_id: str, **kwargs) -> dict:
        """Extract and enrich skills"""
        pass
    
    # ... etc


# Example: Using CareerOS from Claude Desktop
# Claude would have MCP client that connects to CareerOS server
# Then Claude can call:
# - use_mcp_tool("parse_resume", {"resume_text": "..."})
# - use_mcp_tool("analyze_job_posting", {"job_posting": "..."})
# - use_mcp_tool("create_application_packet", {"job_id": "123", "candidate_id": "456"})
```

**MCP Benefits:**
- Claude Desktop can connect
- Cursor can connect
- Anthropic Workbench can connect
- CrewAI can connect
- LangGraph can connect
- Custom agents can connect
- **CareerOS becomes the data + logic layer; any AI can use it**

---

### Layer 6: CareerOS CLI

**User-facing command line:**

```bash
# Setup and Management
careeros init                          # Initialize CareerOS workspace
careeros profile upload resume.pdf     # Import resume into Professional Graph
careeros profile view                  # View your career data

# Job Search and Matching
careeros jobs search "python developer"    # Find jobs
careeros jobs analyze <job_id>             # Analyze specific job
careeros jobs match                        # Find your best matches

# Application Workflow
careeros apply <job_id>                    # Create application packet
careeros apply list --pending              # Show pending approvals
careeros apply submit <packet_id>          # Submit to job board
careeros apply track <app_id>              # Track status

# Market Intelligence
careeros market skills python              # See demand/salary for Python
careeros market role "ML Engineer"         # Research ML Engineer roles
careeros market compare python javascript  # Compare two skills

# Career Development
careeros upskill analyze                    # Identify skill gaps
careeros upskill plan                       # Generate learning plan
careeros interview prep                     # Generate interview talking points

# Configuration
careeros config set model_router.preferred_model claude
careeros config set applications.auto_followup true
careeros config set applications.human_approval required
```

**CLI Implementation:**

```python
# careeros/cli/main.py

import click
from careeros.services import AllServices
from careeros.agents import CoordinatorAgent

@click.group()
def cli():
    """CareerOS: Career Intelligence Platform"""
    pass

@cli.command()
@click.argument('job_url')
def apply(job_url):
    """Create and submit job application."""
    
    coordinator = CoordinatorAgent()
    result = coordinator.coordinate_application(job_url)
    
    print(f"✅ Application packet created")
    print(f"   Resume: {result.resume_file}")
    print(f"   Cover Letter: {result.cover_letter_file}")
    print(f"   Fit Score: {result.fit_score}")
    print(f"\n⏳ Awaiting human approval...")
    print(f"   careeros apply submit {result.packet_id}")

@cli.command()
@click.argument('query')
def market(query):
    """Get market intelligence."""
    
    research_service = AllServices().research
    insights = research_service.research_market(query)
    
    print(f"Market Insights for: {query}")
    print(f"  Demand: {insights.demand_level}")
    print(f"  Median Salary: ${insights.median_salary}")
    print(f"  Trend: {insights.trend}")

if __name__ == '__main__':
    cli()
```

---

## 🗺️ Six-Stage Roadmap to Full Platform

### Stage 1: Foundation (Q3 2026) ✅ MOSTLY COMPLETE

**Goal:** Data layer + basic services

- [x] Professional Graph data model
- [x] Services (Skill, Experience, ATS)
- [x] Resume parsing
- [x] Skill extraction
- [ ] Basic CLI

**Deliverables:**
- Professional Graph schema
- Core services
- Resume import functionality
- Basic CLI commands

---

### Stage 2: Intelligence Engine (Q4 2026)

**Goal:** Multi-variant resume + ATS analysis

- [ ] Resume Intelligence Engine
  - Generate multiple resume variants
  - Tailor to specific jobs
  - ATS optimization
- [ ] Application Packets
  - Resume + cover letter + fit analysis
  - Company research bundled
  - Ready for human review
- [ ] Match Scoring
  - Skill-based matching
  - Experience-based matching
  - Culture fit signals

**Deliverables:**
- Resume variant generation
- Application Packet concept
- Match scoring algorithms
- Dashboard showing top matches

---

### Stage 3: MCP + Agent Foundation (Q1 2027)

**Goal:** Make CareerOS composable

- [ ] CareerOS MCP Server
  - Expose all tools as MCP protocols
  - Test with Claude Desktop
  - Test with Cursor
- [ ] Core Agents
  - ResumeAgent
  - ATSAgent
  - ReviewerAgent
  - CoordinatorAgent
- [ ] Model Router
  - Route tasks to optimal models
  - Cost optimization
  - Fallback handling

**Deliverables:**
- MCP server (production-ready)
- Agent orchestration
- Model router
- Integration tests with Claude Desktop

---

### Stage 4: Agent Runtime (Q2 2027)

**Goal:** Full multi-agent system

- [ ] LangGraph integration
- [ ] Specialized agents
  - Interview Prep Agent
  - Negotiation Agent
  - Marketplace Agent
  - Recruiter Communication Agent
- [ ] Agent choreography
  - Parallel execution
  - Sequential pipelines
  - Conditional routing

**Deliverables:**
- LangGraph-based runtime
- Specialized agents
- Agent composition framework
- Metrics and observability

---

### Stage 5: Human Approval + Autonomous Queue (Q3 2027)

**Goal:** Semi-autonomous application workflow

- [ ] Application approval UI
- [ ] Application queue
- [ ] Scheduled submissions
- [ ] Follow-up automation
- [ ] Browser automation (Playwright)
  - Auto-fill forms where safe
  - Save application data
  - Extract confirmation details

**Deliverables:**
- Web UI for approvals
- Application queue
- Browser automation
- Follow-up scheduling

---

### Stage 6: Full Autonomous Apply (Q4 2027)

**Goal:** Self-driving job applications (with guardrails)

- [ ] Autonomous Apply mode
  - Configurable thresholds (apply only if >80% fit)
  - Daily job monitoring
  - Automatic application
  - Human-in-loop guardrails
- [ ] Interview Prep Agent
  - STAR example generation
  - Company research summary
  - Likely questions prediction
- [ ] Offer Negotiation Agent
  - Salary benchmarking
  - Compensation optimization
  - Negotiation strategy

**Deliverables:**
- Autonomous Apply with safety rails
- Interview Prep workflow
- Full platform maturity

---

## 🏗️ Implementation Architecture

### Directory Structure

```
careeros/
├── core/
│   ├── professional_graph.py       # Core data model
│   ├── models.py                   # Pydantic models
│   └── constants.py                # Enums, constants
│
├── services/
│   ├── skill_service.py
│   ├── experience_service.py
│   ├── ats_service.py
│   ├── application_service.py
│   ├── research_service.py
│   └── __init__.py                 # Export AllServices
│
├── agents/
│   ├── base_agent.py               # Base class
│   ├── resume_agent.py
│   ├── ats_agent.py
│   ├── reviewer_agent.py
│   ├── application_agent.py
│   ├── coordinator_agent.py
│   └── __init__.py
│
├── routing/
│   ├── model_router.py
│   ├── models.py                   # Model configs
│   └── cost_calculator.py
│
├── tools/
│   ├── resume_tools.py
│   ├── job_tools.py
│   ├── research_tools.py
│   ├── application_tools.py
│   └── __init__.py                 # Export all tools
│
├── mcp/
│   ├── server.py                   # MCP server
│   ├── handlers.py                 # Tool handlers
│   └── schema.py                   # MCP schemas
│
├── cli/
│   ├── main.py                     # Main CLI group
│   ├── commands/
│   │   ├── profile.py
│   │   ├── jobs.py
│   │   ├── apply.py
│   │   ├── market.py
│   │   └── config.py
│   └── __init__.py
│
├── storage/
│   ├── graph_db.py                 # Professional Graph storage
│   ├── cache.py                    # LRU cache for queries
│   └── migrations.py               # DB versioning
│
├── api/
│   ├── fastapi_app.py              # REST API (optional)
│   └── models.py
│
└── __init__.py
```

---

## 🔄 Data Flow Example: Stage 2 Application

```
Resume Upload
    ↓
Professional Graph Parser
    ↓ (uses Qwen 2B for extraction)
Structured Career Data
    ↓
[Skill Service] [Experience Service] [Achievement Service]
    ↓ (services enrich and validate data)
Professional Graph (Updated)
    ↓
User searches for jobs
    ↓
Job posting scraped
    ↓
[ATS Service] analyzes posting
    ↓ (uses GPT-4o for keyword extraction)
Job Analysis + Keyword Mapping
    ↓
[Coordinator Agent] orchestrates:
    ├─→ [Resume Agent] creates variant
    │       ↓ (Claude creates tailored resume)
    │   Variant Resume
    │
    ├─→ [ATS Agent] analyzes fit
    │       ↓ (GPT-4o calculates score)
    │   Match Score (82%)
    │
    └─→ [Reviewer Agent] critiques
            ↓ (Claude reviews)
        Feedback + Edits
    ↓
Application Packet Created
    ├─ Resume (tailored)
    ├─ Cover Letter
    ├─ Fit Analysis
    ├─ Company Research
    └─ ATS Score

    ↓
Human Review & Approval
    ↓
Submit to Job Board
```

---

## 🎯 Why This Architecture Wins

### Current (ai-job-search):
```
Problem: If Claude changes, entire system breaks
Solution: Wrap Claude in Python SDK
Result: Still Claude-dependent
```

### Proposed (CareerOS):
```
Problem: Vendor lock-in
Solution: Own the infrastructure, route to models
Result:
  ✅ Any LLM can plug in
  ✅ Agents are composable
  ✅ Tools are model-agnostic
  ✅ Data is canonical
  ✅ Can optimize per-task
  ✅ Professional Graph survives model changes
```

---

## 🚀 Implementation Priority

**What to build FIRST:**

1. **Professional Graph** (Week 1-2)
   - Define schema
   - Implement in Python
   - Test with real resume

2. **Services** (Week 3-4)
   - Skill, Experience, ATS services
   - Implement CRUD operations
   - Integration tests

3. **Resume Agent** (Week 5-6)
   - Query Professional Graph
   - Generate resume variants
   - LaTeX output

4. **ATS Agent + Coordinator** (Week 7-8)
   - Analyze job postings
   - Calculate match scores
   - Orchestrate application

5. **CLI** (Week 9)
   - User-facing commands
   - Integration with services/agents

6. **MCP Server** (Week 10-11)
   - Expose as Model Context Protocol
   - Test with Claude Desktop
   - Test with Cursor

7. **Additional Agents** (Week 12+)
   - Reviewer Agent
   - Application Agent
   - Interview Agent

---

## 💡 Key Insight: What Changes

**What ai-job-search Got Right:**
- ✅ Drafter → Reviewer pattern (brilliant)
- ✅ Application Packet concept (powerful)
- ✅ LaTeX templates + PDF verification
- ✅ Profile structure (foundation)

**What CareerOS Should Change:**
- ❌ Claude as center → Model Router as center
- ❌ Single agent → Multi-agent orchestration
- ❌ Prompt-based → Professional Graph + Services
- ❌ Embedded tools → MCP tools
- ❌ CLI wrapper → Platform with APIs

**The Distinction:**
- ai-job-search is a Claude automation
- CareerOS should be a career platform that **can use Claude**

If Claude disappears tomorrow:
- ai-job-search: Rewrite everything
- CareerOS: Swap model in router, everything else works

---

## 🎓 Next Steps

1. **Review this architecture** with team
2. **Validate Professional Graph schema** against real resumes
3. **Prototype Stage 1** (Graph + Services)
4. **Integrate ai-job-search concepts** (drafter-reviewer, ats scoring)
5. **Build to Stage 2** (Resume Intelligence + Application Packets)
6. **Then iterate Stages 3-6**

The ai-job-search repository proves the workflow works.  
CareerOS should build the platform that makes that workflow **model-agnostic**.

---

**CareerOS Philosophy:**
- Platform > Wrapper
- Architecture > Vendor
- Professional Graph > Resume Files
- Model Router > Super-Agent
- Composable Agents > Monolithic Logic
- MCP Tools > Embedded Tools

This is what CareerOS becomes.
