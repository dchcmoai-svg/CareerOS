# Jobs API Cache Revalidation Setup

## Overview
The jobs API now uses Next.js `force-cache` to cache responses indefinitely until explicitly revalidated. When new jobs are scraped and saved to the database, the cache is automatically revalidated, ensuring fresh data without hitting the database on every request.

## How It Works

1. **Initial Request**: Client requests `/api/jobs` → Next.js serves cached response (if available)
2. **Scraping Completes**: Backend task calls `/api/revalidate-jobs` 
3. **Cache Invalidated**: Next.js clears the cache for the jobs endpoint
4. **Next Request**: Client gets fresh data from database

## Environment Variables

Set these in your `.env.local` (Frontend) and `.env` (Backend):

### Frontend (.env.local or .env.production.local)
```env
# For revalidation endpoint
REVALIDATE_TOKEN=your-secret-token-here
```

### Backend (.env or production settings)
```env
# For triggering revalidation from scraper tasks
FRONTEND_URL=http://localhost:3000  # or your production frontend URL
REVALIDATE_TOKEN=your-secret-token-here  # Must match frontend
```

## Setup Instructions

1. **Generate a secure token** (use a strong random string):
   ```bash
   # On Linux/Mac
   openssl rand -hex 32
   
   # Or use Python
   python3 -c "import secrets; print(secrets.token_hex(32))"
   ```

2. **Set the environment variables**:
   - Add `REVALIDATE_TOKEN` to your Frontend `.env.local`
   - Add `FRONTEND_URL` and `REVALIDATE_TOKEN` to your Backend `.env`

3. **Test the cache revalidation**:
   ```bash
   # From Backend directory
   curl -X POST http://localhost:3000/api/revalidate-jobs \
     -H "X-Revalidate-Token: your-secret-token-here" \
     -H "Content-Type: application/json"
   ```

   You should see:
   ```json
   {
     "revalidated": true,
     "timestamp": "2024-XX-XXT00:00:00.000Z",
     "message": "Jobs cache revalidated successfully"
   }
   ```

## Benefits

- **Reduced Database Load**: Responses cached for 1 year (until revalidated)
- **Faster Page Loads**: No database query needed for cached responses
- **Fresh Data**: Cache automatically cleared when new jobs are scraped
- **Bandwidth Savings**: Cached responses avoid repeated network round-trips
- **Automatic**: No manual cache invalidation needed

## Troubleshooting

### Cache not revalidating?
- Check that `REVALIDATE_TOKEN` matches between frontend and backend
- Ensure `FRONTEND_URL` is correct and accessible from backend
- Check backend logs for cache revalidation errors
- Verify the scraper task actually saved/updated jobs (check `records_saved` > 0)

### Still seeing stale data?
- Browser cache might be active - use hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
- Check if `records_saved` or `records_updated` in scraper results > 0
- Manually trigger revalidation via curl command above

## Implementation Details

### Frontend Changes
- `/api/jobs/route.ts`: Added `cache: 'force-cache'` and long max-age headers
- `/api/revalidate-jobs/route.ts`: New endpoint for revalidation (requires token)

### Backend Changes
- `scraper/tasks.py`: 
  - Added `trigger_jobs_cache_revalidation()` function
  - All scraper tasks now call revalidation after saving jobs
  - Only triggers if `records_saved > 0` or `records_updated > 0`
