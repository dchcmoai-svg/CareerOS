# Complete Guide: Replacing Claude APIs in AI Job Search

## Executive Summary

**Status of Repository:** The ai-job-search framework is a sophisticated Claude Code application. While not directly calling Claude REST APIs, it's tightly coupled to the Claude Code ecosystem. The repository's CLI tools (jobindex-search, jobnet-search, etc.) are partially complete/under development.

**API Replacement Complexity:** ⭐⭐⭐⭐ (4/5 - Significant refactoring needed)

---

## Current Architecture Deep Dive

### What This Framework Does

1. **Profile Management**: Captures candidate info (education, experience, skills, behavioral profile)
2. **Job Search**: Queries Danish job portals (Jobindex, Jobnet, Akademikernes Jobbank)
3. **Fit Evaluation**: Matches candidates to jobs using a scoring framework
4. **Document Generation**: Creates tailored CVs and cover letters in LaTeX
5. **Review & Refinement**: Multi-agent workflow (drafter + reviewer)
6. **Interview Prep**: Generates talking points and STAR examples

### Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Main orchestration** | Claude Code CLI | Workflow coordination |
| **AI logic** | Claude 3.5 Sonnet | All LLM reasoning |
| **Job search** | TypeScript/Bun + HTML parsing | Data collection |
| **Document generation** | LaTeX (moderncv, custom cover.cls) | PDF output |
| **Utilities** | Python 3.10+ | Salary lookup, converters |
| **File management** | Standard I/O | Profile/document storage |

### Current API Dependencies

The system uses **zero explicit REST API calls** to Claude. Instead:

```
User Command
    ↓
Claude Code CLI
    ↓
Claude API (behind the scenes)
    ↓
Claude's built-in tools:
  - WebSearch (Bing Search)
  - WebFetch (HTTP GET)
  - Read/Write files
  - Run Bash commands
  - Spawn sub-agents
    ↓
Application Output
```

---

## Replacement Strategies

### Strategy 1: Replace with Anthropic Python SDK (RECOMMENDED)

**Best for**: Staying with Claude, removing Code dependency

#### Overview

Convert Claude Code commands to Python scripts using the Anthropic SDK.

#### Step-by-Step Conversion

**Current (Claude Code):**
```markdown
# .claude/commands/apply.md
## Step 1: Parse Input
Read job posting via WebFetch
Extract job details
```

**Replacement (Python SDK):**
```python
# apply.py
#!/usr/bin/env python3

import anthropic
import sys
from pathlib import Path

def read_job_posting(url_or_text: str) -> str:
    """Fetch job posting from URL or use provided text"""
    if url_or_text.startswith("http"):
        import requests
        return requests.get(url_or_text).text
    return url_or_text

def apply_job_workflow(job_input: str):
    client = anthropic.Anthropic()
    
    # Step 1: Parse input
    job_posting = read_job_posting(job_input)
    
    # Step 2: Read profile
    profile_path = Path('.claude/skills/job-application-assistant/01-candidate-profile.md')
    candidate_profile = profile_path.read_text()
    
    # Step 3: Evaluate fit
    evaluation_prompt = f"""
    Candidate Profile:
    {candidate_profile}
    
    Job Posting:
    {job_posting}
    
    Evaluate fit and provide:
    1. Skills match (required vs. gaps)
    2. Experience alignment
    3. Cultural fit assessment
    4. Overall score (strong/moderate/weak)
    """
    
    fit_evaluation = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=2000,
        messages=[
            {"role": "user", "content": evaluation_prompt}
        ]
    )
    
    print("## Fit Evaluation")
    print(fit_evaluation.content[0].text)
    
    # Step 4: Ask user to proceed
    user_response = input("\nProceed with CV and cover letter draft? (y/n): ")
    if user_response.lower() != 'y':
        return
    
    # Step 5: Draft documents
    draft_prompt = f"""
    Based on the candidate profile and job posting, generate:
    
    1. A tailored CV in LaTeX format (moderncv/banking style)
    2. A cover letter in LaTeX format
    
    Candidate: {candidate_profile}
    Job: {job_posting}
    
    Remember to:
    - Tailor the profile statement
    - Reframe experience bullets to match job keywords
    - Keep CV to 2 pages
    - Keep cover letter to 1 page
    """
    
    drafts = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=8000,
        messages=[
            {"role": "user", "content": draft_prompt}
        ]
    )
    
    print("\n## Drafts Generated")
    print(drafts.content[0].text)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        apply_job_workflow(sys.argv[1])
    else:
        print("Usage: python apply.py <url_or_job_description>")
        sys.exit(1)
```

#### Implementation Roadmap

**Phase 1: Setup (1-2 weeks)**
```bash
# 1. Create CLI wrapper
python setup.py --interview    # Replace /setup
python setup.py --section search

# 2. Implement core workflow
class ApplyWorkflow:
    def __init__(self, api_key: str):
        self.client = anthropic.Anthropic(api_key=api_key)
    
    def evaluate_fit(self, job_posting: str, profile: str) -> dict:
        """Replaces fit evaluation step"""
        
    def draft_documents(self, job_posting: str, profile: str) -> dict:
        """Replaces drafter agent"""
        
    def review_and_revise(self, drafts: dict) -> dict:
        """Replaces reviewer agent"""
```

**Phase 2: Job Search (1 week)**
```python
# scrape.py
def search_jobs(profile: dict, focus: str = None):
    """Replace /scrape command"""
    # Use WebSearch via Claude API
    # Parse results
    # Deduplicate with seen_jobs.json
    # Present matches
```

**Phase 3: Integration (3-5 days)**
```bash
python cli.py setup              # Replace /setup
python cli.py scrape             # Replace /scrape  
python cli.py apply <url>        # Replace /apply
python cli.py upskill            # Replace /upskill
```

#### Required Dependencies

```python
# requirements.txt
anthropic>=0.28.0
requests>=2.31.0
python-dotenv>=1.0.0
```

#### Advantages

✅ Minimal architecture change  
✅ Keep Claude's reasoning capabilities  
✅ Easy debugging (direct API calls)  
✅ Better token efficiency (control batching)  
✅ Can use function calling for tool use  

#### Disadvantages

❌ Lose Claude Code's interactive REPL  
❌ Need to implement CLI commands  
❌ Lose IDE-like features  
❌ Need custom WebSearch/WebFetch integration

---

### Strategy 2: Replace with OpenAI API (Moderate Effort)

**Best for**: Using GPT-4, cost optimization, or OpenAI preference

#### Key Differences from Claude

```python
from openai import OpenAI

client = OpenAI(api_key="sk-...")

# Similar, but different response format
response = client.chat.completions.create(
    model="gpt-4-turbo",
    max_tokens=2000,
    messages=[
        {"role": "user", "content": "..."}
    ]
)

print(response.choices[0].message.content)
```

#### Implementation Guide

```python
# apply_openai.py
from openai import OpenAI

class JobApplicationOpenAI:
    def __init__(self, api_key: str):
        self.client = OpenAI(api_key=api_key)
    
    def evaluate_fit(self, job_posting: str, profile: str) -> str:
        response = self.client.chat.completions.create(
            model="gpt-4-turbo",
            max_tokens=2000,
            messages=[{
                "role": "user",
                "content": f"Evaluate candidate fit:\n\n{profile}\n\nJob:\n{job_posting}"
            }]
        )
        return response.choices[0].message.content
    
    def draft_cv(self, profile: str, job_posting: str, company: str) -> str:
        response = self.client.chat.completions.create(
            model="gpt-4-turbo",
            max_tokens=4000,
            messages=[{
                "role": "user",
                "content": f"""Generate a LaTeX CV (moderncv/banking style) tailored for:
                
Company: {company}
Job: {job_posting}
Profile: {profile}

Output ONLY the LaTeX code."""
            }]
        )
        return response.choices[0].message.content
```

#### Unique Features for OpenAI

- **Vision API**: Can read job posting PDFs/images directly
- **Function Calling**: Better structured outputs
- **Embeddings**: For similarity matching jobs to profiles

#### Trade-offs

| Aspect | Claude API | OpenAI API |
|--------|-----------|-----------|
| Reasoning | Stronger | Good |
| Code generation | Excellent | Very Good |
| Creativity | Very good | Excellent |
| Cost (1M tokens) | $3-15 | $10-30 |
| Speed | Medium | Fast |
| Context window | 200K | 128K |

---

### Strategy 3: Hybrid (Best Experience)

**Keep Claude Code for interactive tasks, use SDK for automation**

```
User Journey:
    ↓
Manual Setup (/setup interactive)
    ↓ (Claude Code REPL)
    ↓
Profile files created
    ↓
Automated Workflows (Python SDK)
    ↓
/scrape, /apply via Python CLI
    ↓
Results back to user
```

#### Implementation

```bash
# cli.py - Main entry point
$ python cli.py setup      # Uses Claude Code (interactive)
$ python cli.py scrape     # Uses Python SDK (background)
$ python cli.py apply url  # Uses Python SDK (background)
```

#### Advantages

✅ Best of both worlds  
✅ Familiar interactive setup experience  
✅ Reliable background automation  
✅ Can optimize each phase  

#### Disadvantages

❌ More complex to maintain  
❌ Two different codebases  
❌ Requires API key management

---

## Migration Path

### Phase 1: Setup (Immediate)

```bash
# 1. Install Anthropic SDK
pip install anthropic

# 2. Create configuration
export ANTHROPIC_API_KEY="sk-..."

# 3. Create wrapper
cat > config/anthropic_config.py << 'EOF'
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

def create_client():
    return Anthropic()
EOF
```

### Phase 2: Implement Core Functions (Week 1)

```python
# ai_service.py
class AIService:
    def __init__(self):
        self.client = create_client()
    
    def evaluate_fit(self, profile: str, job: str) -> dict:
        """Replaces /apply Step 1"""
        
    def draft_cv(self, profile: str, job: str) -> str:
        """Replaces /apply Step 2"""
        
    def draft_cover_letter(self, profile: str, job: str) -> str:
        """Replaces /apply Step 2"""
        
    def search_jobs(self, search_terms: List[str]) -> List[dict]:
        """Replaces /scrape"""
        
    def get_reviewer_feedback(self, cv: str, letter: str, job: str) -> dict:
        """Replaces reviewer agent"""
```

### Phase 3: CLI Commands (Week 2)

```python
# cli.py
import click
from ai_service import AIService

service = AIService()

@click.group()
def cli():
    pass

@cli.command()
@click.argument('url')
def apply(url):
    """Apply to a job"""
    job_posting = fetch_url(url)
    profile = load_profile()
    
    # Evaluate fit
    fit = service.evaluate_fit(profile, job_posting)
    print(fit)
    
    # Draft documents
    cv = service.draft_cv(profile, job_posting)
    letter = service.draft_cover_letter(profile, job_posting)
    
    # Get review
    feedback = service.get_reviewer_feedback(cv, letter, job_posting)
    
    # Output
    save_documents(cv, letter)

@cli.command()
def scrape():
    """Search for jobs"""
    profile = load_profile()
    search_terms = profile.get('search_queries', [])
    
    jobs = service.search_jobs(search_terms)
    save_results(jobs)

if __name__ == '__main__':
    cli()
```

### Phase 4: Integration (Week 3)

```bash
# Replace Claude Code commands
# /apply <url>  →  python cli.py apply <url>
# /scrape       →  python cli.py scrape
# /setup        →  python cli.py setup  (or keep Claude Code)
```

---

## Tool Integration Strategy

### WebSearch/WebFetch Alternative

#### Current (Claude Code built-in):
```
WebSearch("Python developer jobs Denmark 2025")
WebFetch("https://jobindex.dk/...")
```

#### Replacement Options

**Option A: Use Browser Requests**
```python
import requests
from bs4 import BeautifulSoup

def search_jobs_web(query: str) -> List[dict]:
    """Search using Bing/Google"""
    search_url = f"https://www.bing.com/search?q={query}"
    response = requests.get(search_url)
    soup = BeautifulSoup(response.content, 'html.parser')
    # Parse results
    return results
```

**Option B: Use Perplexity API**
```python
import anthropic

def search_jobs_perplexity(query: str) -> str:
    """Use Perplexity for web-aware search"""
    client = anthropic.Anthropic(
        api_key="ppl_...",  # Perplexity API key
        base_url="https://api.perplexity.ai"
    )
    # Perplexity is Claude-compatible
    response = client.messages.create(
        model="sonar-pro",
        messages=[{"role": "user", "content": query}]
    )
    return response.content[0].text
```

**Option C: Keep CLI Tools**
```python
import subprocess
import json

def search_jobs_via_cli(query: str) -> dict:
    """Use existing jobindex-search CLI"""
    result = subprocess.run(
        ["bun", "run", "src/cli.ts", "search", "--query", query, "--format", "json"],
        cwd=".agents/skills/jobindex-search/cli",
        capture_output=True,
        text=True
    )
    return json.loads(result.stdout)
```

**Recommendation**: **Option C** (use existing CLI tools) + **Option B** (Perplexity for web research)

---

## Cost Analysis

### Current Setup (Claude Code)

Assuming:
- 3 job applications/week
- ~50K tokens per application (evaluation + drafting + review)
- ~20 weeks/year

```
50K tokens × 3 apps × 20 weeks = 3M tokens/year
Cost: $30-50 (with Claude subscription)
```

### Python SDK Approach

Same usage:
```
Anthropic: 3M tokens × $0.003-0.015/1K tokens = $9-45/year
OpenAI:    3M tokens × $0.01-0.03/1K tokens   = $30-90/year
Perplexity: $15/month = $180/year
```

**Verdict**: Python SDK is ~same or cheaper, with more control

---

## Testing Strategy

### Before Migration

```python
# test_api_replacement.py
import anthropic

def test_fit_evaluation():
    """Ensure replacement produces similar output"""
    client = anthropic.Anthropic()
    
    # Old output (from Claude Code logs)
    old_fit_score = "strong fit"
    
    # New output (from SDK)
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1000,
        messages=[...]
    )
    new_fit_score = response.content[0].text
    
    assert "fit" in new_fit_score.lower()

def test_document_generation():
    """Ensure LaTeX output is valid"""
    # Generate CV
    # Compile with lualatex
    # Verify PDF is readable
```

### After Migration

```bash
# Run on known jobs to compare outputs
python cli.py apply https://jobindex.dk/job/123 > output.txt
# Compare with expected output
diff output.txt expected_output.txt
```

---

## Rollout Plan

### Week 1: Foundation
- [ ] Set up Anthropic Python SDK
- [ ] Create AI service wrapper
- [ ] Implement fit evaluation
- [ ] Test with 3-5 sample jobs

### Week 2: Core Features
- [ ] Implement document generation (CV + cover letter)
- [ ] Implement reviewer agent (spawn sub-agent via API)
- [ ] Implement job search
- [ ] CLI command skeleton

### Week 3: Integration
- [ ] Full end-to-end `/apply` workflow
- [ ] Full `/scrape` workflow
- [ ] LaTeX compilation and PDF inspection
- [ ] Error handling and logging

### Week 4: Refinement
- [ ] Performance optimization
- [ ] Cost optimization
- [ ] Documentation
- [ ] User testing

---

## Key Implementation Details

### Managing Context Windows

Claude Code handled context automatically. You need to:

```python
def manage_context(profile: str, job: str, max_tokens: int = 4000) -> str:
    """Compress context to fit in API limits"""
    profile_summary = summarize_profile(profile, tokens=1000)
    job_summary = summarize_job(job, tokens=500)
    
    system_prompt = """You are a job application assistant..."""
    
    total_used = len(system_prompt) + len(profile_summary) + len(job_summary)
    if total_used > 100000:  # Claude's 200K context
        profile_summary = profile_summary[:500]  # Further compress
    
    return f"{system_prompt}\n\nProfile:\n{profile_summary}\n\nJob:\n{job_summary}"
```

### Function Calling for Tool Use

Unlike Claude Code's automatic tools, implement explicitly:

```python
def apply_with_tools(job_url: str):
    """Use function calling for tool use"""
    
    tools = [
        {
            "name": "fetch_url",
            "description": "Fetch content from a URL",
            "input_schema": {
                "type": "object",
                "properties": {
                    "url": {"type": "string"}
                },
                "required": ["url"]
            }
        },
        {
            "name": "search_web",
            "description": "Search the web for information",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {"type": "string"}
                },
                "required": ["query"]
            }
        }
    ]
    
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=4096,
        tools=tools,
        messages=[
            {"role": "user", "content": f"Apply to this job: {job_url}"}
        ]
    )
    
    # Handle tool calls in response
    while response.stop_reason == "tool_use":
        # Process tool calls
        # Add results to messages
        # Call API again
        pass
```

---

## Troubleshooting Guide

### Issue: "Long context overrun"

**Cause**: Profile + job posting exceeds token limit

**Solution**:
```python
def truncate_profile(profile: str, max_size: int = 2000) -> str:
    """Keep only essential profile data"""
    lines = profile.split('\n')
    size = 0
    result = []
    for line in lines:
        if size + len(line) > max_size:
            break
        result.append(line)
        size += len(line)
    return '\n'.join(result)
```

### Issue: "PDF compilation fails"

**Cause**: Generated LaTeX has syntax errors

**Solution**:
```python
def validate_latex(tex_content: str) -> bool:
    """Check LaTeX syntax before compiling"""
    # Balanced braces?
    if tex_content.count('{') != tex_content.count('}'):
        raise ValueError("Unbalanced braces")
    
    # Required packages?
    if r'\documentclass' not in tex_content:
        raise ValueError("Missing documentclass")
    
    return True
```

### Issue: "Job search returns no results"

**Cause**: Search queries not matching job portals

**Solution**:
```python
def optimize_search_queries(profile: dict) -> List[str]:
    """Generate portal-specific search queries"""
    # Jobindex prefers Danish keywords
    # LinkedIn uses English
    # Jobnet searches government jobs
    
    queries = {
        "jobindex": f"{profile['role_title']} {profile['location']}",
        "linkedin": f"{profile['skills']} {profile['country']}",
        "jobnet": f"{profile['role_title']}",
    }
    return queries
```

---

## Conclusion

**Recommended Path**: Strategy 1 (Anthropic Python SDK)

- **Time**: 2-3 weeks
- **Complexity**: Medium
- **Benefit**: Keep Claude's capabilities, full API control
- **Cost**: Same or lower than current
- **Maintenance**: Easier than Claude Code workflow

The ai-job-search framework is well-designed and transferable. The core logic is solid; only the orchestration layer needs to change. Using the Python SDK keeps the powerful Claude reasoning while gaining transparency and control over the workflow.

---

## Resources

- [Anthropic Python SDK](https://github.com/anthropic-ai/anthropic-sdk-python)
- [Anthropic API Docs](https://docs.anthropic.com)
- [Claude API Reference](https://docs.anthropic.com/claude/reference)
- [Function Calling Guide](https://docs.anthropic.com/claude/guide/tool-use)
- [Original Repository](https://github.com/MadsLorentzen/ai-job-search)
