#!/bin/bash

echo "Starting server..."
# Point to where manage.py actually lives
python Main/manage.py runserver 0.0.0.0:8000
