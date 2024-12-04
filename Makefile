dev:
	python manage.py runserver 127.0.0.1:8030

migrate:
	python manage.py makemigrations main && python manage.py migrate

css:
	npx tailwindcss -i ./main/static/main/input.css -o ./main/static/main/style.css --watch