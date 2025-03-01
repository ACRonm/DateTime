FROM node:18-alpine

WORKDIR /app

# Add build-time arguments
ARG NEXT_PUBLIC_API_URL

# Set environment variable for build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
