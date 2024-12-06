bend:
	cd server && python manage.py runserver 127.0.0.1:8030

fend:
	cd client && npm run dev

migrate:
	cd server && python manage.py makemigrations main && python manage.py migrate

css:
	cd client && npx tailwindcss -i ./main/static/main/input.css -o ./main/static/main/style.css --watch

deploy:
	./deploy.sh