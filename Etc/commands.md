# CareerOS Commands

## 1. Activate the virtual environment

cd /home/kumar-kushang/CareerOS
source ./venv/bin/activate

## 2. Start Redis

sudo systemctl start redis-server
redis-cli ping

## 3. Run database migrations

python manage.py makemigrations
python manage.py migrate

## 4. Start the Django development server

python manage.py runserver

## 5. Start Celery worker and scheduler

# In one terminal, run the worker:
celery -A config worker -l info

# In another terminal, run the beat scheduler:
celery -A config beat -l info

## 6. Scraping commands

### BrightData LinkedIn scraping by URL

export BRIGHTDATA_API_KEY="your_brightdata_api_key"
export BRIGHTDATA_DATASET_LINKEDIN_URL="your_linkedin_url_dataset_id"
export BRIGHTDATA_DATASET_LINKEDIN_KEYWORD="your_linkedin_keyword_dataset_id"
export BRIGHTDATA_DATASET_LINKEDIN_COMPANY="your_linkedin_company_dataset_id"

python manage.py scrape_brightdata_linkedin --url "https://www.linkedin.com/jobs/view/software-engineer-at-epic-3986111804?_l=en"

### BrightData LinkedIn scraping by JSON payload file

python manage.py scrape_brightdata_linkedin --input-file ./brightdata_input.json

### Dynamic LinkedIn discovery generation

python manage.py discover_linkedin_jobs --dry-run --keywords "backend engineer" --locations "United States"
python manage.py discover_linkedin_jobs --keywords "backend engineer" --locations "United States"

### Reusable job search ingestion

python manage.py search_jobs --keywords "software engineer" --location "remote" --source "linkedin-brightdata"

## 7. Bootstrap scraper sources (optional)

python manage.py shell -c "from scraper.models import ScrapeSource; ScrapeSource.objects.update_or_create(name='greenhouse', defaults={'source_type':'greenhouse','scrape_frequency_minutes':15,'enabled':True}); ScrapeSource.objects.update_or_create(name='remoteok', defaults={'source_type':'remoteok','scrape_frequency_minutes':30,'enabled':True}); ScrapeSource.objects.update_or_create(name='lever', defaults={'source_type':'lever','scrape_frequency_minutes':60,'enabled':True}); ScrapeSource.objects.update_or_create(name='stripe-lever', defaults={'source_type':'stripe-lever','scrape_frequency_minutes':60,'enabled':True});"

## 8. Trigger tasks manually (optional)

python manage.py shell -c "from scraper.tasks import scrape_all_jobs, export_jobs_to_google_sheets_task; scrape_all_jobs.delay(); export_jobs_to_google_sheets_task.delay()"
python manage.py shell -c "from scraper.tasks import scrape_greenhouse_jobs_task; scrape_greenhouse_jobs_task.delay()"
python manage.py shell -c "from scraper.tasks import scrape_lever_jobs_task; scrape_lever_jobs_task.delay()"
python manage.py shell -c "from scraper.tasks import scrape_remoteok_jobs_task; scrape_remoteok_jobs_task.delay()"

## 9. Useful Django utilities

python manage.py shell
python manage.py dbshell







//


python manage.py discover_linkedin_jobs \
  --keywords "backend engineer,frontend engineer,ai engineer" \
  --locations "United States,India,Remote" \
  --pages 3