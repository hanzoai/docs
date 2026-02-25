FROM nginx:alpine
COPY out/ /usr/share/nginx/html/
RUN printf 'server {\n  listen 3000;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / {\n    try_files $uri $uri.html $uri/ /404.html;\n  }\n  location /health {\n    return 200 "ok";\n  }\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
