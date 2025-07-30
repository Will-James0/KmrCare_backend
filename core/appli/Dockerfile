# Étape unique : Django + copier React build
FROM python:3.13-alpine

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copier le code backend Django
COPY backend/ /app/

# Copier le build React (déjà présent dans react/)
COPY react/ /app/static/   # ✅ c’est là que ton index.html et assets vont

# Installer les dépendances
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Collecte des fichiers statiques (y compris React)
RUN python manage.py collectstatic --noinput

EXPOSE 8000
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]
