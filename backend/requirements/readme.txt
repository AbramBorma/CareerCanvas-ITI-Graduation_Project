export DJANGO_SETTINGS_MODULE=career_canvas.settings.development

source ~/.bashrc

python3 manage.py runserver

sudo -u postgres psql

CREATE DATABASE career_canvas;
CREATE USER career_canvas WITH PASSWORD 'iti_GP';
ALTER ROLE career_canvas SET client_encoding TO 'utf8';
ALTER ROLE career_canvas SET default_transaction_isolation TO 'read committed';
ALTER ROLE career_canvas SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE career_canvas TO career_canvas;

sudo apt-get update

sudo apt-get install postgresql postgresql-contrib

sudo apt-get install libpq-dev

