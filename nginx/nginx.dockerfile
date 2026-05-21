FROM nginx:alpine
RUN apk upgrade --no-cache
COPY ./nginx.conf /etc/nginx
COPY ../app/static/ /usr/share/nginx/html