from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
from typing import List, Dict, Any
import time


# Greenhouse company board URLs
# Format: company_slug -> (board_url, company_name)
GREENHOUSE_COMPANIES = {
    "stripe": ("https://stripe.com/jobs/search", "Stripe"),
    "openai": ("https://jobs.openai.com", "OpenAI"),
    "anthropic": ("https://www.anthropic.com/careers", "Anthropic"),
    "notion": ("https://notion.com/careers", "Notion"),
    "datadog": ("https://www.datadoghq.com/careers", "Datadog"),
    "scale": ("https://boards.greenhouse.io/scaleai", "Scale AI"),
}


def scrape_greenhouse_company_jobs(company_slug: str = "stripe") -> List[Dict[str, Any]]:
    """
    Generic Greenhouse scraper for multiple companies.
    
    Args:
        company_slug: Company identifier (e.g., 'stripe', 'openai', 'notion')
    
    Returns:
        List of standardized job dictionaries
    """
    
    if company_slug not in GREENHOUSE_COMPANIES:
        print(f"⚠️ Unknown company slug: {company_slug}")
        return []
    
    board_url, company_name = GREENHOUSE_COMPANIES[company_slug]
    
    print(f"🔄 Scraping Greenhouse jobs for {company_name} from {board_url}")
    
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    
    try:
        driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()),
            options=options
        )
        
        driver.get(board_url)
        
        # Wait for page to load
        time.sleep(5)
        
        html = driver.page_source
        soup = BeautifulSoup(html, "lxml")
        
        # Save HTML for debugging
        with open(f"/tmp/{company_slug}_jobs.html", "w") as f:
            f.write(html)
        
        data = []
        
        # Try to find jobs table (Greenhouse standard)
        jobs_table = soup.find_all("table", class_="Table__table")
        
        if jobs_table:
            print(f"✅ Found {len(jobs_table)} job tables for {company_name}")
            
            rows = jobs_table[0].find_all("tr")
            
            for row in rows:
                cells = row.find_all("td")
                if len(cells) < 2:
                    continue
                
                try:
                    role = cells[0].text.strip()
                    team = cells[1].text.strip() if len(cells) > 1 else ""
                    location = cells[2].text.strip() if len(cells) > 2 else ""
                    
                    link_tag = cells[0].find("a")
                    if not link_tag:
                        continue
                    
                    href = link_tag.get("href", "")
                    
                    # Build full URL
                    if href.startswith("http"):
                        job_url = href
                    elif href.startswith("/"):
                        job_url = board_url.split("/jobs")[0] + href if "/jobs" in board_url else board_url.rstrip("/") + href
                    else:
                        job_url = board_url.rstrip("/") + "/" + href
                    
                    job_data = {
                        "title": role,
                        "team": team,
                        "company": company_name,
                        "office_location": location,
                        "remote_location": "Remote" if "remote" in location.lower() else "",
                        "work_mode": "remote" if "remote" in location.lower() else "onsite",
                        "url": job_url,
                        "source": "greenhouse",
                        "department": team,
                    }
                    
                    if job_data["title"] and job_data["url"]:
                        data.append(job_data)
                
                except Exception as e:
                    print(f"⚠️ Error parsing row for {company_name}: {e}")
                    continue
        
        else:
            print(f"⚠️ No job tables found for {company_name} at {board_url}")
        
        driver.quit()
        
        print(f"✅ Found {len(data)} jobs for {company_name}")
        return data
    
    except Exception as e:
        print(f"❌ Error scraping {company_name}: {str(e)}")
        return []


# Legacy function for backwards compatibility
def scrape_greenhouse_jobs() -> List[Dict[str, Any]]:
    """
    Scrape Stripe Greenhouse jobs (for backwards compatibility).
    """
    return scrape_greenhouse_company_jobs("stripe")