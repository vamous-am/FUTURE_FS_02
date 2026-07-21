import js from '@eslint/js';
import babelParser from '@babel/eslint-parser';
import prettier from 'eslint-config-prettier';

/**
 * ESLint configuration for the Mini CRM workspace.
 * @typescript-eslint/parser crashes on module load under TypeScript 7
 * (typescript-eslint/typescript-eslint#12518) — its init code reads
 * ScriptTarget.Cjs, which does not exist in TS7's compiler.
 * Using @babel/eslint-parser + @babel/preset-typescript instead: syntax-level
 * TS linting only, no @typescript-eslint/* rules. Revisit once typescript-eslint
 * ships TS7 support.
 */
export default [
  { ignores: ['**/dist', '**/node_modules', '**/.pnpm-store'] },
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-typescript', '@babel/preset-react'],
        },
      },
    },
    ...js.configs.recommended,
    ...prettier,
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['**/*.tsx', '**/*.jsx'],
    rules: {
      'no-unused-vars': 'off',
    },
  },
];
