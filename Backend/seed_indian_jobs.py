import os
import django
import sys
from datetime import datetime, timezone, timedelta

# Set up Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from scraper.models import Job

INDIAN_JOBS = [
    {
        "title": "Software Engineer - Backend Core",
        "company": "Zomato",
        "office_location": "Gurugram, Haryana, India",
        "remote_location": "",
        "work_mode": "onsite",
        "url": "https://zomato.jobs/se-backend-core",
        "source": "lever",
        "salary": "₹18,00,000 - ₹24,00,000 /yr",
        "city": "Gurugram",
        "country": "India",
        "description": "Join the core platform backend engineering team at Zomato. We build highly scalable systems that process millions of orders per day. You will design, build and optimize services using Go, Node.js, Redis, and PostgreSQL.",
    },
    {
        "title": "Frontend Engineer (React/Next.js)",
        "company": "Swiggy",
        "office_location": "Bengaluru, Karnataka, India",
        "remote_location": "",
        "work_mode": "hybrid",
        "url": "https://swiggy.jobs/frontend-react-nextjs",
        "source": "greenhouse",
        "salary": "₹15,00,000 - ₹20,00,000 /yr",
        "city": "Bengaluru",
        "country": "India",
        "description": "We are looking for a Frontend Engineer with deep experience in React.js, Next.js, and TypeScript to build smooth web ordering experiences. Focus will be on high-performance pages, SEO optimization, and responsive design.",
    },
    {
        "title": "AI/ML Engineer (LLMs & Search)",
        "company": "Razorpay",
        "office_location": "",
        "remote_location": "Remote, India",
        "work_mode": "remote",
        "url": "https://razorpay.jobs/ai-ml-engineer-llm",
        "source": "greenhouse",
        "salary": "₹22,00,000 - ₹30,00,000 /yr",
        "city": "Bengaluru",
        "country": "India",
        "description": "Integrate cutting-edge LLMs and retrieval-augmented generation systems into Razorpay's merchant support and search products. Experience with Python, PyTorch, Transformers, OpenAI APIs, and Vector databases (Pinecone/Milvus) is highly valued.",
    },
    {
        "title": "UI/UX Product Designer",
        "company": "Cred",
        "office_location": "Bengaluru, Karnataka, India",
        "remote_location": "",
        "work_mode": "onsite",
        "url": "https://cred.club/careers/uiux-designer",
        "source": "lever",
        "salary": "₹14,00,000 - ₹18,00,000 /yr",
        "city": "Bengaluru",
        "country": "India",
        "description": "Design premium, aesthetically pleasing, and dark-themed interface elements that define the signature CRED app. You will craft experiences, build components in the Master Design System, and conduct user research.",
    },
    {
        "title": "DevOps & SRE Lead",
        "company": "Paytm",
        "office_location": "Noida, Uttar Pradesh, India",
        "remote_location": "",
        "work_mode": "onsite",
        "url": "https://paytm.com/careers/devops-sre-lead",
        "source": "lever",
        "salary": "₹20,00,000 - ₹28,00,000 /yr",
        "city": "Noida",
        "country": "India",
        "description": "Spearhead Paytm's transactional server availability and container orchestration. You will manage Kubernetes clusters, AWS infrastructure, CI/CD pipelines via Jenkins/GitLab, and automate infrastructure using Terraform.",
    },
    {
        "title": "Data Engineer (Analytics Platform)",
        "company": "Zepto",
        "office_location": "Mumbai, Maharashtra, India",
        "remote_location": "",
        "work_mode": "hybrid",
        "url": "https://zepto.jobs/data-engineer-analytics",
        "source": "greenhouse",
        "salary": "₹16,00,000 - ₹22,00,000 /yr",
        "city": "Mumbai",
        "country": "India",
        "description": "Build high-throughput data processing pipelines for Zepto's 10-minute delivery analytics. Write complex PySpark scripts, orchestrate DAGs in Apache Airflow, and model datasets in Snowflake.",
    },
    {
        "title": "Software Engineer - Fullstack",
        "company": "Flipkart",
        "office_location": "Bengaluru, Karnataka, India",
        "remote_location": "",
        "work_mode": "hybrid",
        "url": "https://flipkart.careers/fullstack-engineer",
        "source": "greenhouse",
        "salary": "₹18,00,000 - ₹25,00,000 /yr",
        "city": "Bengaluru",
        "country": "India",
        "description": "Build features for Flipkart's marketplace listings. Requires strong knowledge of Java, Spring Boot, MySQL, and React.js. You will own features end-to-end, from database schemas to client-side renders.",
    },
    {
        "title": "Cybersecurity Analyst",
        "company": "HCLTech",
        "office_location": "Noida, Uttar Pradesh, India",
        "remote_location": "",
        "work_mode": "hybrid",
        "url": "https://hcltech.careers/cybersecurity-analyst",
        "source": "other",
        "salary": "₹8,00,000 - ₹12,00,000 /yr",
        "city": "Noida",
        "country": "India",
        "description": "Conduct network security audits, vulnerability assessments, and penetration testing on enterprise servers. Monitor SIEM logs and remediate vulnerabilities against OWASP Top 10 vulnerabilities.",
    },
    {
        "title": "Product Manager (Payments)",
        "company": "PhonePe",
        "office_location": "Bengaluru, Karnataka, India",
        "remote_location": "",
        "work_mode": "onsite",
        "url": "https://phonepe.jobs/pm-payments",
        "source": "lever",
        "salary": "₹25,00,000 - ₹35,00,000 /yr",
        "city": "Bengaluru",
        "country": "India",
        "description": "Define the product roadmap for PhonePe payments infrastructure. Collaborate with merchants, engineering leads, and banking partners to create seamless UPI and wallet checkout flows.",
    },
    {
        "title": "Sales Development Representative",
        "company": "Freshworks",
        "office_location": "Chennai, Tamil Nadu, India",
        "remote_location": "",
        "work_mode": "hybrid",
        "url": "https://freshworks.jobs/sdr-chennai",
        "source": "other",
        "salary": "₹6,00,000 - ₹9,00,000 /yr",
        "city": "Chennai",
        "country": "India",
        "description": "Drive outbound lead generation campaigns targeting global small and medium business accounts. Qualify leads, conduct discovery calls, and manage relationships inside HubSpot CRM.",
    },
    {
        "title": "Senior React Native Engineer",
        "company": "Groww",
        "office_location": "Bengaluru, Karnataka, India",
        "remote_location": "",
        "work_mode": "onsite",
        "url": "https://groww.jobs/react-native-sr",
        "source": "greenhouse",
        "salary": "₹24,00,000 - ₹32,00,000 /yr",
        "city": "Bengaluru",
        "country": "India",
        "description": "Own Groww's investment mobile application features. Optimize React Native bridges, native modules (iOS/Android), and frame rate performance to deliver lightning-fast trade executions.",
    },
    {
        "title": "Backend Systems Engineer (Rust/Go)",
        "company": "InMobi",
        "office_location": "Bengaluru, Karnataka, India",
        "remote_location": "",
        "work_mode": "hybrid",
        "url": "https://inmobi.jobs/backend-rust-go",
        "source": "lever",
        "salary": "₹20,00,000 - ₹26,00,000 /yr",
        "city": "Bengaluru",
        "country": "India",
        "description": "Optimize real-time bidding algorithms running at sub-millisecond latencies. Build high-concurrency systems using Rust and Go, interacting with Kafka brokers and Aerospike datastores.",
    }
]

def seed():
    print("Deleting old jobs...")
    deleted, _ = Job.objects.all().delete()
    print(f"Deleted {deleted} old jobs.")

    now = datetime.now(timezone.utc)
    for idx, j_data in enumerate(INDIAN_JOBS):
        posted_at = now - timedelta(days=idx)
        job = Job(
            title=j_data["title"],
            company=j_data["company"],
            office_location=j_data["office_location"],
            remote_location=j_data["remote_location"],
            work_mode=j_data["work_mode"],
            url=j_data["url"],
            source=j_data["source"],
            salary=j_data["salary"],
            city=j_data["city"],
            country=j_data["country"],
            description=j_data["description"],
            posted_at=posted_at,
            last_seen_at=now,
            is_active=True
        )
        job.save()
        print(f"Created Job: {job.title} at {job.company}")

    print(f"Successfully seeded {len(INDIAN_JOBS)} Indian jobs!")

if __name__ == "__main__":
    seed()
