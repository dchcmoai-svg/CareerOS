# AI Job Search Repository Analysis

## Overview

**Repository:** https://github.com/MadsLorentzen/ai-job-search  
**Purpose:** An AI-powered job application framework built on Claude Code (Anthropic's CLI for Claude)  
**Use Case:** Helps automate job searching, fit evaluation, CV tailoring, and cover letter writing  
**Tech Stack:** Python 3.10+, TypeScript/Bun, LaTeX, Claude Code

---

## Project Structure

```
ai-job-search/
├── CLAUDE.md                    # Main candidate profile (job context)
├── .claude/
│   ├── commands/               # /setup, /apply, /scrape, /upskill, /reset
│   ├── skills/
│   │   ├── job-application-assistant/  # Core CV/cover letter generation
│   │   ├── job-scraper/        # Job search orchestration
│   │   └── upskill/            # Skill gap analysis
│   └── settings.local.json     # Claude Code permissions
├── .agents/skills/             # CLI tools for Danish job portals
│   ├── jobindex-search/        # Jobindex.dk search tool
│   ├── jobnet-search/          # Jobnet.dk search tool
│   ├── jobbank-search/         # Akademikernes Jobbank search tool
│   └── jobdanmark-search/      # Jobdanmark.dk search tool
├── cv/                         # LaTeX CV templates (moderncv)
├── cover_letters/              # LaTeX cover letter templates (custom cover.cls)
├── documents/                  # User's career source materials
└── tools/                      # Salary lookup utility (Python)
```

---

## Core Workflow

### 1. **Setup Phase** (`/setup`)
- Claude Code interviews user or reads documents
- Populates profile files with education, experience, skills, behavioral profile
- Creates LaTeX CV template
- Generates job search queries

### 2. **Job Search Phase** (`/scrape`)
- Claude Code runs WebSearch queries against Danish job sites
- Uses CLI tools in `.agents/skills/` to fetch from:
  - Jobindex.dk
  - Jobnet.dk
  - Akademikernes Jobbank
  - Jobdanmark.dk
- Deduplicates results
- Presents matches with quick fit scores

### 3. **Application Phase** (`/apply`)
- **Drafter Agent**: Evaluates job fit, drafts tailored CV + cover letter
- **Reviewer Agent**: Researches company, critiques drafts
- **Revision**: Applies feedback, compiles PDFs, inspects layout
- **Verification**: Runs checklist to ensure quality

### 4. **Career Development** (`/upskill`)
- Analyzes skill gaps between profile and target roles
- Generates learning plans with time estimates

---

## How Claude APIs Are Currently Used

### **Direct API Usage: MINIMAL** ⚠️

Contrary to what you might expect, **this system does NOT make direct calls to Claude API endpoints**. Instead:

#### **Current Implementation:**
1. **Claude Code CLI** - The entire workflow is orchestrated through Anthropic's `@anthropic-ai/claude-code` CLI tool
2. **No API Key Management** - Claude Code handles authentication (via Claude Pro subscription or API key)
3. **Built-in Tool Calls** - Claude Code has native support for:
   - `WebFetch` - fetches HTML/JSON from URLs
   - `WebSearch` - searches the web
   - `Read`, `Write`, `Edit` - file operations
   - `Bash` - terminal commands
   - `Agent` - spawns sub-agents for parallel work

#### **Evidence:**
- `.claude/settings.local.json` shows allowed tool permissions, not API configurations
- No `ANTHROPIC_API_KEY` required in workflow (only for Claude Code CLI itself)
- All AI logic runs within Claude Code's context window

### **Job Search Tools: NO API CALLS**
The `.agents/skills/` directory contains TypeScript/Bun CLI tools that:
- Scrape HTML from Danish job sites directly
- Parse job listings from HTML
- Return JSON formatted results
- Do NOT call any APIs (neither Claude nor job board APIs)

---

## Can Claude APIs Be Replaced?

### **YES, but with significant refactoring**

#### **Current Dependency Chain:**
```
Claude Code CLI
    ↓
  Claude API (via subscription/key)
    ↓
Claude Code's built-in tools (WebFetch, WebSearch, etc.)
    ↓
Application workflow
```

#### **Three Scenarios for Replacement:**

### **Option 1: Replace with OpenAI API (Moderate Effort)**

**What needs to change:**
1. Remove Claude Code dependency entirely
2. Implement orchestration layer using OpenAI SDK
3. Rebuild workflow logic to call OpenAI API directly
4. Reimplement tools (WebSearch, WebFetch functionality)

**Approximate Changes:**
- Rewrite `.claude/commands/` as Python scripts calling `openai.ChatCompletion.create()`
- Implement function calling for tool use
- Add own WebSearch/WebFetch integration (Perplexity API, Bing Search API, or web scraping)
- Adapt profile files to work with new system

**Pros:**
- OpenAI has mature ecosystem and better documentation
- Potentially cheaper with GPT-4o
- Better parallelization capabilities

**Cons:**
- Lose Claude's strong reasoning for complex tasks
- Need to reimplement workflow orchestration from scratch
- Lose tight integration with Claude Code's tools

---

### **Option 2: Use Anthropic's Python SDK (Easiest for Replacement)**

**What needs to change:**
1. Keep Anthropic's Claude API
2. Replace Claude Code CLI with direct Python SDK calls
3. Rewrite commands as Python scripts using `anthropic.Anthropic()` client

**Approximate Changes:**
```python
from anthropic import Anthropic

client = Anthropic()

# Current: claude /apply <url>
# New: python apply.py <url>

def apply_job(job_url):
    # Step 1: Fetch job posting
    job_posting = fetch_url(job_url)
    
    # Step 2: Read profile files
    profile = read_profile()
    
    # Step 3: Call Claude API directly
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=4096,
        tools=[...],  # Define function calls
        messages=[...]
    )
```

**Pros:**
- Minimal architecture change
- Keep Claude's reasoning capabilities
- Much easier than Option 1
- All existing profile/template files remain unchanged

**Cons:**
- Lose Claude Code's interactive REPL experience
- Need to implement CLI commands manually
- Lose IDE-like features of Claude Code

---

### **Option 3: Hybrid Approach (Best for Feature Parity)**

**What needs to change:**
1. Keep Claude Code for interactive onboarding (`/setup`)
2. Use Python SDK for batch operations (`/scrape`, `/apply`)
3. Implement custom orchestration layer

**Pros:**
- Best user experience (interactive setup, reliable automation)
- Easier migration path
- Can iterate gradually

**Cons:**
- More complex to maintain two codebases

---

## Effort Breakdown by Component

| Component | Current | Effort to Replace | Notes |
|-----------|---------|------------------|-------|
| **Profile Setup** | Claude Code interactive | Medium | Could use CLI questionnaire instead |
| **Job Scraping** | Claude Code + CLI tools | Low | CLI tools are independent; just need Web APIs |
| **CV Generation** | Claude Code (drafter agent) | Medium | API call logic is simple; workflow logic is complex |
| **Reviewer Agent** | Claude Code (spawned sub-agent) | Medium | Needs function calling + tool use |
| **LaTeX Compilation** | Bash commands | None | Already independent |
| **File Management** | Claude Code Read/Write | Low | Standard file I/O |
| **WebSearch** | Claude Code built-in | High | Need third-party service (Bing, Perplexity, etc.) |

---

## Key Limitations of Current System

1. **Requires Claude Code subscription** - Not available for free tier Claude API users
2. **No direct API control** - Can't batch requests or optimize token usage
3. **Limited to Danish job markets** - Job search tools are hardcoded for Danish sites
4. **Vendor lock-in** - Tightly coupled to Claude Code

---

## Recommendations

### **If you want to try the repo as-is:**
```bash
# 1. Install Claude Code
npm install -g @anthropic-ai/claude-code

# 2. Set up API key (Anthropic or Claude Pro subscription)
export ANTHROPIC_API_KEY="sk-..."

# 3. Clone and run
gh repo fork MadsLorentzen/ai-job-search --clone
cd ai-job-search
claude
/setup
/scrape
/apply <url>
```

### **If you want to replace Claude APIs:**

**Best approach:**
1. **Start with Option 2** (Anthropic Python SDK) - minimal refactoring
2. Rewrite commands as Python scripts
3. Implement function calling for tool use (WebFetch, WebSearch)
4. Keep profile/template files unchanged
5. Migrate incrementally: `/apply` first, then `/scrape`, then `/setup`

**Estimated Effort:**
- Option 2: ~2-3 weeks for one developer
- Option 1: ~4-6 weeks
- Option 3: ~5-8 weeks

---

## Code Examples

### **Current (Claude Code):**
```markdown
# .claude/commands/apply.md
## Step 1: Parse Input
- Use `WebFetch` to retrieve the job posting
- Extract company name, role, location

## Step 2: Evaluate Fit
- Read `04-job-evaluation.md`
- Compare with candidate profile
- Present fit assessment to user
```

### **Replacement (Python + Anthropic API):**
```python
# apply.py
import anthropic
import re
from pathlib import Path

def apply_job(job_url: str):
    client = anthropic.Anthropic()
    
    # Step 1: Parse job posting
    job_posting = fetch_url(job_url)
    
    # Step 2: Read profile
    profile = Path('.claude/skills/job-application-assistant/01-candidate-profile.md').read_text()
    
    # Step 3: Call Claude API
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=8000,
        system="""You are a job application assistant...""",
        messages=[
            {
                "role": "user",
                "content": f"""
                Candidate Profile:
                {profile}
                
                Job Posting:
                {job_posting}
                
                Evaluate fit and draft CV + cover letter...
                """
            }
        ]
    )
    
    return response.content[0].text
```

---

## Integration Points to Watch

1. **WebSearch/WebFetch**: Need to use Bing Search API, Perplexity API, or custom scraping
2. **File I/O**: Standard Python; no changes needed
3. **LaTeX compilation**: Already uses Bash; no changes needed
4. **Agent spawning**: Implement via context window management
5. **Tool use**: Implement via function calling in API

---

## Conclusion

The **ai-job-search repository is NOT a typical REST API consumer** - it's a Claude Code application. To replace Claude APIs:

1. **Least effort**: Use Anthropic's Python SDK (stay with Claude, just remove Code dependency)
2. **Most flexibility**: Migrate to OpenAI API (requires full rewrite)
3. **Hybrid**: Use both Claude Code (setup) and Python SDK (automation)

The core logic is adaptable; the workflow design is sound and transferable to any LLM provider that supports function calling and tool use.
