#!/usr/bin/env python3
"""
Practical Implementation Example: Job Application Assistant using Anthropic SDK

This demonstrates how to replace Claude Code with direct Anthropic API calls.
Replaces /apply and /scrape commands from the ai-job-search framework.
"""

import json
import os
import sys
from pathlib import Path
from typing import Optional
import anthropic


# Configuration
class Config:
    """Configuration for the AI Job Application Assistant"""
    
    # API Settings
    API_KEY = os.environ.get("ANTHROPIC_API_KEY")
    MODEL = "claude-3-5-sonnet-20241022"
    MAX_TOKENS = 4096
    
    # Paths (relative to project root)
    PROFILE_DIR = Path(".claude/skills/job-application-assistant")
    CV_DIR = Path("cv")
    COVER_LETTER_DIR = Path("cover_letters")
    OUTPUT_DIR = Path("job_applications")
    
    # Profile files
    CANDIDATE_PROFILE = PROFILE_DIR / "01-candidate-profile.md"
    JOB_EVALUATION = PROFILE_DIR / "04-job-evaluation.md"
    CV_TEMPLATES = PROFILE_DIR / "05-cv-templates.md"
    COVER_LETTER_TEMPLATES = PROFILE_DIR / "06-cover-letter-templates.md"
    WRITING_STYLE = PROFILE_DIR / "03-writing-style.md"
    
    def __init__(self):
        if not self.API_KEY:
            raise ValueError("ANTHROPIC_API_KEY environment variable not set")
        self.output_dir.mkdir(exist_ok=True)


# ============================================================================
# Core AI Service
# ============================================================================

class JobApplicationAI:
    """Main service for job application tasks"""
    
    def __init__(self, config: Optional[Config] = None):
        self.config = config or Config()
        self.client = anthropic.Anthropic(api_key=self.config.API_KEY)
        
        # Load profile and templates
        self._load_resources()
    
    def _load_resources(self):
        """Load profile and template files"""
        self.candidate_profile = self._read_file(self.config.CANDIDATE_PROFILE)
        self.job_evaluation_framework = self._read_file(self.config.JOB_EVALUATION)
        self.cv_templates = self._read_file(self.config.CV_TEMPLATES)
        self.cover_letter_templates = self._read_file(self.config.COVER_LETTER_TEMPLATES)
        self.writing_style = self._read_file(self.config.WRITING_STYLE)
    
    @staticmethod
    def _read_file(path: Path) -> str:
        """Read a file, return empty string if not found"""
        if path.exists():
            return path.read_text()
        print(f"⚠️  Warning: {path} not found, using empty template")
        return ""
    
    # ========================================================================
    # Step 1: Evaluate Job Fit
    # ========================================================================
    
    def evaluate_job_fit(self, job_posting: str) -> dict:
        """
        Evaluate how well the job matches the candidate's profile.
        
        Returns:
            dict: {
                "fit_score": "strong/moderate/weak",
                "skills_match": "...",
                "experience_match": "...",
                "culture_match": "...",
                "recommendation": "...",
            }
        """
        print("📊 Evaluating job fit...")
        
        prompt = f"""
You are a career advisor evaluating job fit for a candidate.

CANDIDATE PROFILE:
{self.candidate_profile}

JOB POSTING:
{job_posting}

EVALUATION FRAMEWORK:
{self.job_evaluation_framework}

Evaluate the candidate's fit for this job using the framework above.

Provide a structured evaluation with:
1. **Skills Match** - Which required/preferred skills match vs. gaps
2. **Experience Match** - How work history maps to the role
3. **Culture/Behavioral Match** - Personality and values alignment
4. **Overall Fit Score** - strong/moderate/weak
5. **Recommendation** - Should they apply? Why or why not?

Keep it concise but thorough.
"""
        
        response = self.client.messages.create(
            model=self.config.MODEL,
            max_tokens=2000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        evaluation_text = response.content[0].text
        
        return {
            "evaluation": evaluation_text,
            "tokens_used": response.usage.input_tokens + response.usage.output_tokens
        }
    
    # ========================================================================
    # Step 2: Draft CV and Cover Letter
    # ========================================================================
    
    def draft_documents(self, job_posting: str, company_name: str) -> dict:
        """
        Draft a tailored CV and cover letter for the job.
        
        Returns:
            dict: {"cv": "...", "cover_letter": "..."}
        """
        print("✍️  Drafting CV and cover letter...")
        
        prompt = f"""
You are an expert resume writer and cover letter specialist.

CANDIDATE PROFILE:
{self.candidate_profile}

CV TEMPLATE GUIDANCE:
{self.cv_templates}

COVER LETTER TEMPLATE GUIDANCE:
{self.cover_letter_TEMPLATES}

WRITING STYLE GUIDE:
{self.writing_style}

TARGET JOB:
{job_posting}

TARGET COMPANY:
{company_name}

Task: Generate BOTH documents below:

## 1. TAILORED CV
- Follow LaTeX moderncv/banking format
- Tailor profile statement to the job
- Reframe experience bullets to match job keywords
- Keep to exactly 2 pages
- Use proper LaTeX syntax (\\\\cventry, \\\\cvitem, etc.)

[GENERATE COMPLETE LaTeX CV HERE]

## 2. COVER LETTER
- Follow LaTeX cover.cls format
- Match the language of the job posting
- Address to "Dear Hiring Manager" if no name provided
- Tailor opening paragraph to specific role and company
- Keep to approximately 1 page
- Use proper LaTeX syntax

[GENERATE COMPLETE LaTeX COVER LETTER HERE]

CRITICAL: All claims must be factually accurate based on the candidate profile. 
Do NOT fabricate skills or experience.
"""
        
        response = self.client.messages.create(
            model=self.config.MODEL,
            max_tokens=8000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        draft_text = response.content[0].text
        
        # Parse out CV and cover letter sections (simplified)
        cv = self._extract_section(draft_text, "## 1. TAILORED CV", "## 2. COVER LETTER")
        cover_letter = self._extract_section(draft_text, "## 2. COVER LETTER", None)
        
        return {
            "cv": cv,
            "cover_letter": cover_letter,
            "tokens_used": response.usage.input_tokens + response.usage.output_tokens
        }
    
    @staticmethod
    def _extract_section(text: str, start_marker: str, end_marker: Optional[str]) -> str:
        """Extract text between markers"""
        start_idx = text.find(start_marker)
        if start_idx == -1:
            return text  # Return all if marker not found
        
        start_idx += len(start_marker)
        
        if end_marker:
            end_idx = text.find(end_marker, start_idx)
            if end_idx == -1:
                return text[start_idx:]
            return text[start_idx:end_idx]
        
        return text[start_idx:]
    
    # ========================================================================
    # Step 3: Get Reviewer Feedback
    # ========================================================================
    
    def get_reviewer_feedback(
        self,
        cv: str,
        cover_letter: str,
        job_posting: str,
        company_name: str
    ) -> dict:
        """
        Get feedback from a reviewer agent (simulated via separate API call).
        
        Returns:
            dict: {"feedback": "...", "suggestions": [...]}
        """
        print("👥 Getting reviewer feedback...")
        
        prompt = f"""
You are a hiring manager reviewing a job application.

CANDIDATE PROFILE:
{self.candidate_profile}

BEHAVIORAL PROFILE:
{self.writing_style}

CV DRAFT:
{cv}

COVER LETTER DRAFT:
{cover_letter}

JOB POSTING:
{job_posting}

COMPANY:
{company_name}

Task: Review the CV and cover letter for this job application. Provide:

1. **Keywords Missing** - Important requirements from the job posting not addressed
2. **Company Alignment** - How well does the application show understanding of the company?
3. **Tone and Style Issues** - Is the voice authentic and compelling?
4. **Content Gaps** - What should be added or reframed?
5. **Overall Assessment** - Is this application competitive? Why or why not?

Structure your feedback as:
- STRENGTHS (2-3 key strengths)
- GAPS (2-3 areas to improve)
- SPECIFIC EDITS (concrete suggestions for 3-5 edits)

Do NOT suggest fabricating skills. Focus on reframing existing experience.
"""
        
        response = self.client.messages.create(
            model=self.config.MODEL,
            max_tokens=2000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        feedback_text = response.content[0].text
        
        return {
            "feedback": feedback_text,
            "tokens_used": response.usage.input_tokens + response.usage.output_tokens
        }
    
    # ========================================================================
    # Step 4: Search for Jobs (using Claude's text analysis)
    # ========================================================================
    
    def analyze_job_opportunities(self, search_results: list) -> list:
        """
        Analyze a list of job postings for fit.
        Use in conjunction with web search or CLI tools.
        
        Args:
            search_results: List of dicts with 'title', 'company', 'url', 'description'
        
        Returns:
            List of jobs with fit scores
        """
        print(f"🔍 Analyzing {len(search_results)} job opportunities...")
        
        prompt = f"""
CANDIDATE PROFILE:
{self.candidate_profile}

EVALUATION FRAMEWORK:
{self.job_evaluation_framework}

JOBS TO EVALUATE:
{json.dumps(search_results, indent=2)}

For each job, provide a quick fit assessment (HIGH/MEDIUM/LOW) with 1-2 sentences explaining why.

Format your response as:
JOB 1: [TITLE] - [FIT LEVEL]
Reason: [brief explanation]

JOB 2: ...
etc.
"""
        
        response = self.client.messages.create(
            model=self.config.MODEL,
            max_tokens=1000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        analysis_text = response.content[0].text
        
        # Parse results and add fit scores
        for result in search_results:
            if f"HIGH" in analysis_text and result['title'] in analysis_text:
                result['fit_score'] = "HIGH"
            elif f"MEDIUM" in analysis_text and result['title'] in analysis_text:
                result['fit_score'] = "MEDIUM"
            else:
                result['fit_score'] = "LOW"
        
        return search_results


# ============================================================================
# CLI Commands
# ============================================================================

def apply_command(job_url_or_text: str, company_name: str = "Unknown Company"):
    """Execute /apply workflow"""
    print(f"\n{'='*60}")
    print(f"Applying to: {company_name}")
    print(f"{'='*60}\n")
    
    ai = JobApplicationAI()
    
    # Step 1: Evaluate fit
    fit_result = ai.evaluate_job_fit(job_url_or_text)
    print("\n📊 FIT EVALUATION:")
    print(fit_result['evaluation'])
    
    # Ask user to proceed
    proceed = input("\n✅ Proceed with drafting CV and cover letter? (y/n): ").lower()
    if proceed != 'y':
        print("❌ Cancelled")
        return
    
    # Step 2: Draft documents
    draft_result = ai.draft_documents(job_url_or_text, company_name)
    print("\n✍️  DRAFTS CREATED")
    print("CV:", draft_result['cv'][:200] + "...")
    print("\nCover Letter:", draft_result['cover_letter'][:200] + "...")
    
    # Step 3: Get feedback
    feedback_result = ai.get_reviewer_feedback(
        draft_result['cv'],
        draft_result['cover_letter'],
        job_url_or_text,
        company_name
    )
    print("\n👥 REVIEWER FEEDBACK:")
    print(feedback_result['feedback'])
    
    # Step 4: Save files
    output_dir = Path("outputs") / company_name.replace(" ", "_")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    (output_dir / "cv.tex").write_text(draft_result['cv'])
    (output_dir / "cover_letter.tex").write_text(draft_result['cover_letter'])
    (output_dir / "evaluation.txt").write_text(fit_result['evaluation'])
    (output_dir / "feedback.txt").write_text(feedback_result['feedback'])
    
    print(f"\n✅ Files saved to: {output_dir}")
    
    # Calculate total tokens used
    total_tokens = (
        fit_result['tokens_used'] +
        draft_result['tokens_used'] +
        feedback_result['tokens_used']
    )
    print(f"\n📊 Total tokens used: {total_tokens}")


def scrape_command(search_queries: list):
    """
    Execute /scrape workflow.
    Note: This demonstrates job analysis; actual job search requires web tools.
    """
    print(f"\n{'='*60}")
    print(f"Searching for jobs...")
    print(f"{'='*60}\n")
    
    # Example jobs (in real implementation, fetch from job portals)
    example_jobs = [
        {
            "title": "Senior Python Developer",
            "company": "Tech Startup",
            "url": "https://example.com/job/1",
            "description": "Looking for a Python expert with 5+ years experience..."
        },
        {
            "title": "Machine Learning Engineer",
            "company": "AI Company",
            "url": "https://example.com/job/2",
            "description": "Build ML models using Python, TensorFlow, scikit-learn..."
        },
    ]
    
    ai = JobApplicationAI()
    results = ai.analyze_job_opportunities(example_jobs)
    
    print("📋 JOB MATCHES:\n")
    for job in results:
        print(f"{'='*60}")
        print(f"Title: {job['title']}")
        print(f"Company: {job['company']}")
        print(f"Fit: {job.get('fit_score', 'UNKNOWN')}")
        print(f"URL: {job['url']}")
        print(f"{'='*60}\n")


# ============================================================================
# Main
# ============================================================================

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python apply_example.py apply <job_url_or_text> [company_name]")
        print("  python apply_example.py scrape")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "apply":
        job_input = sys.argv[2] if len(sys.argv) > 2 else input("Enter job URL or description: ")
        company = sys.argv[3] if len(sys.argv) > 3 else input("Enter company name: ")
        apply_command(job_input, company)
    
    elif command == "scrape":
        scrape_command([])
    
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)
