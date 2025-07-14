// ESLint flat config for Next.js + TypeScript + Tailwind CSS
import js from '@eslint/js';
import next from 'eslint-config-next';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  js(),
  ...next(),
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      // Add TypeScript-specific rules here
    },
  },
  {
    files: ['**/*.tsx', '**/*.jsx'],
    rules: {
      // React/JSX rules can go here
    },
  },
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    rules: {
      // Example: allow Tailwind's arbitrary values
      'no-unknown-property': 'off',
    },
  },
]; 