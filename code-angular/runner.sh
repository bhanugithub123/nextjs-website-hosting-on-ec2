#!/bin/sh

echo "Starting application..."
echo "API_URL = ${API_URL}"
envsubst < "/usr/share/nginx/html/assets/env.json" > "/usr/share/nginx/html/assets/env.json"
nginx -g 'daemon off;'