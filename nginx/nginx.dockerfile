FROM nginx:alpine
RUN apk upgrade --no-cache
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY app/static/ /usr/share/nginx/html