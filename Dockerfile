# Stage 1: Build Stage
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --prod

# Stage 2: Production Stage
FROM nginx:alpine
COPY --from=build-stage /app/dist/swapi-battles /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
