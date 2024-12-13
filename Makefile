bend:
	cd server && python manage.py runserver 127.0.0.1:8030

fend:
	cd client && npm run dev

migrate:
	cd server && python manage.py makemigrations main && python manage.py migrate

deploy:
	cd client && npm run build
	cd server && rm -rf staticfiles
	cd server && python manage.py collectstatic
