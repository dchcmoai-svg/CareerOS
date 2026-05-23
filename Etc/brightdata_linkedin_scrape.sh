#!/usr/bin/env bash
set -euo pipefail

# Activate the project virtual env
source ./venv/bin/activate

# Ensure required env vars are set
: "${BRIGHTDATA_API_KEY:?BRIGHTDATA_API_KEY is required}"
: "${BRIGHTDATA_DATASET_LINKEDIN_URL:?BRIGHTDATA_DATASET_LINKEDIN_URL is required}"
: "${BRIGHTDATA_DATASET_LINKEDIN_KEYWORD:?BRIGHTDATA_DATASET_LINKEDIN_KEYWORD is required}"
: "${BRIGHTDATA_DATASET_LINKEDIN_COMPANY:?BRIGHTDATA_DATASET_LINKEDIN_COMPANY is required}"

if [[ "$#" -lt 1 ]]; then
  echo "Usage: $0 [--url URL]... [--input-file PATH]"
  echo "Example:"
  echo "  $0 --url 'https://www.linkedin.com/jobs/view/software-engineer-at-epic-3986111804?_l=en'"
  echo "  $0 --input-file brightdata_input.json"
  exit 1
fi

python manage.py scrape_brightdata_linkedin "$@"
