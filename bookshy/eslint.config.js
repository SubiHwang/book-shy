import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import prettierPlugin from 'eslint-plugin-prettier';

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn', // any 타입 사용 시 경고
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // 사용하지 않는 변수 경고

      // React 관련 필수 규칙들
      'react/prop-types': 'off', // TypeScript를 사용하므로 prop-types 불필요
      'react/react-in-jsx-scope': 'off', // React 17 이상에서는 import React 불필요
      'react-hooks/rules-of-hooks': 'error', // Hooks 규칙 검사
      'react-hooks/exhaustive-deps': 'warn', // useEffect 의존성 배열 관련 경고

      // Prettier 규칙을 ESLint 경고로 표시
      'prettier/prettier': ['error', { endOfLine: 'auto' }], // Prettier 규칙을 ESLint 경고로 표시
    },
    languageOptions: {
      ecmaVersion: 2020,
      parserOptions: {
        jsx: true, // JSX 구문 지원
      },
    },
  },
);
