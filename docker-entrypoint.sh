#!/bin/sh

# Check if API_HOST is set
if [ -z "$API_HOST" ]; then
  echo "Error: API_HOST environment variable is not set."
  exit 1
fi

# Replace __API_HOST__ in the template with the value of API_HOST
sed "s/__API_HOST__/${API_HOST}/g" /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Start Nginx
exec "$@"

