from scraper.models import ScrapeSource
from scraper.tasks import (
    scrape_greenhouse_jobs_task,
    scrape_remoteok_jobs_task,
    scrape_lever_jobs_task,
    scrape_brightdata_linkedin_keyword_task,
    scrape_brightdata_linkedin_urls_task,
)
from scraper.exporters.google_sheets import export_jobs_to_google_sheets

print('Starting sequential scrape run...')

print('\n== Greenhouse ==')
try:
    print(scrape_greenhouse_jobs_task())
except Exception as e:
    print('Greenhouse failed:', e)

print('\n== RemoteOK ==')
try:
    print(scrape_remoteok_jobs_task())
except Exception as e:
    print('RemoteOK failed:', e)

# Run LinkedIn BrightData sources if configured
linkedin_sources = list(ScrapeSource.objects.filter(enabled=True, source_type='linkedin-brightdata'))
if linkedin_sources:
    for s in linkedin_sources:
        print(f"\n== LinkedIn BrightData for source: {s.name} ==")
        metadata = s.metadata or {}
        urls = metadata.get('urls') or []
        try:
            if urls:
                print('Using URL list from metadata, count=', len(urls))
                print(scrape_brightdata_linkedin_urls_task(urls))
            else:
                inputs = []
                keywords = s.keywords or []
                locations = s.locations or []
                for kw in keywords:
                    if locations:
                        for loc in locations:
                            inputs.append({'keyword': kw, 'location': loc})
                    else:
                        inputs.append({'keyword': kw})
                if inputs:
                    print('Using keyword inputs, count=', len(inputs))
                    print(scrape_brightdata_linkedin_keyword_task(inputs))
                else:
                    print('No inputs configured for this LinkedIn source; skipping.')
        except Exception as e:
            print('LinkedIn BrightData scrape failed for', s.name, str(e))
else:
    print('\nNo LinkedIn BrightData sources configured. Skipping LinkedIn.')

print('\n== Lever ==')
try:
    print(scrape_lever_jobs_task())
except Exception as e:
    print('Lever failed:', e)

print('\n== Export to Google Sheets ==')
try:
    print(export_jobs_to_google_sheets())
except Exception as e:
    print('Export failed:', e)

print('\nDone.')
