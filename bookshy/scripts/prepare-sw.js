// scripts/prepare-sw.js
/* eslint-disable */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// ES 모듈에서 __dirname 구현
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dotenv 동적 로드 (선택적)
let dotenvConfigured = false;
try {
  const { default: dotenv } = await import('dotenv');
  dotenv.config();
  dotenvConfigured = true;
  console.log('환경 변수가 .env 파일에서 로드되었습니다.');
} catch (err) {
  console.log('dotenv 로드 중 오류 발생, 시스템 환경 변수만 사용합니다:', err.message);
}

// 필수 환경 변수 확인
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ 누락된 환경 변수가 있습니다:', missingEnvVars.join(', '));
  console.error('이 환경 변수들을 .env 파일이나 CI/CD 환경에 추가해주세요.');
  process.exit(1);
}

// Firebase 설정 객체 생성
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:
    process.env.VITE_FIREBASE_STORAGE_BUCKET ||
    `${process.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

// 템플릿 파일 경로 (.txt 확장자 사용)
const swTemplatePath = path.join(__dirname, '../src/templates/firebase-messaging-sw-template.txt');

// 템플릿 파일 존재 확인
if (!fs.existsSync(swTemplatePath)) {
  console.error(`❌ 템플릿 파일이 없습니다: ${swTemplatePath}`);
  console.error('src/templates/firebase-messaging-sw-template.txt 파일을 생성해주세요.');
  process.exit(1);
}

// 템플릿 파일 읽기
const swTemplate = fs.readFileSync(swTemplatePath, 'utf8');

// 환경 변수 주입
const swContent = swTemplate.replace(
  '{{FIREBASE_CONFIG}}',
  JSON.stringify(firebaseConfig, null, 2),
);

// 결과 파일 경로
const publicSwPath = path.join(__dirname, '../public/firebase-messaging-sw.js');

// 디렉토리 존재 확인
const publicDir = path.dirname(publicSwPath);
if (!fs.existsSync(publicDir)) {
  console.log(`📁 public 디렉토리 생성: ${publicDir}`);
  fs.mkdirSync(publicDir, { recursive: true });
}

// 파일 저장
fs.writeFileSync(publicSwPath, swContent);

console.log(`✅ Firebase 메시징 서비스 워커가 생성되었습니다: ${publicSwPath}`);
