# Use the official Python image
FROM python:3.10

# Set the working directory inside the container
WORKDIR /app

# Copy and install dependencies first (better for caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code
COPY Main ./Main
COPY entrypoint.sh .

# FIX: Remove hidden Windows carriage returns (\r) and make executable
RUN sed -i 's/\r$//' entrypoint.sh && chmod +x entrypoint.sh

# Expose the port Django runs on
EXPOSE 8000

# Run the entrypoint script
CMD ["./entrypoint.sh"]
