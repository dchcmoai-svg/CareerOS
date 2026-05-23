import os

import django
from celery import Celery
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE',
    'config.settings'
)

django.setup()

from django.conf import settings

app = Celery('config')

app.conf.update(
    broker_url=settings.CELERY_BROKER_URL,
    result_backend=settings.CELERY_RESULT_BACKEND,
    accept_content=settings.CELERY_ACCEPT_CONTENT,
    task_serializer=settings.CELERY_TASK_SERIALIZER,
)

app.autodiscover_tasks()

celery = app