# Dockerfile for React application
# 1. node.js 환경에서 react 빌드
FROM node:22-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN NODE_ENV=production npm run build

# 2. nginx 환경에서 react 빌드 결과물 배포
FROM nginx:alpine

# vite 프로젝트는 dist 폴더에 빌드 결과물이 생성됨
COPY --from=build /app/dist /usr/share/nginx/html

# 중요: public 디렉토리 내용도 복사
COPY --from=build /app/public /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
EXPOSE 80