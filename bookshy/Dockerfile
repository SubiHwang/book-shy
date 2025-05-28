# Dockerfile for React application
FROM node:22-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .
# .env.production 파일이 있으면 .env로 복사 (빌드 시 문제 방지)
RUN if [ -f .env.production ]; then cp .env.production .env; fi
RUN NODE_ENV=production npm run build

# nginx 환경에서 react 빌드 결과물 배포
FROM nginx:alpine

# vite 프로젝트는 dist 폴더에 빌드 결과물이 생성됨
COPY --from=build /app/dist /usr/share/nginx/html

# public 디렉토리 내용 추가 복사 (dist에 포함되지 않은 경우를 대비)
COPY --from=build /app/public /usr/share/nginx/html

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
EXPOSE 80