import js from '@eslint/js';
import babelParser from '@babel/eslint-parser';
import prettier from 'eslint-config-prettier';

/**
 * ESLint configuration for the Mini CRM workspace.
 *
 * Parser: @babel/eslint-parser + @babel/preset-typescript.
 * @typescript-eslint/parser crashes on module load under TypeScript 7
 * (typescript-eslint/typescript-eslint#12518) — its init code reads
 * ScriptTarget.Cjs, which does not exist in TS7's Go-rewrite compiler.
 * Revisit when typescript-eslint ships TS7 support.
 *
 * Unused-variable coverage for .ts files:
 * The core ESLint no-unused-vars rule produces false positives on `import type`
 * statements when using the Babel parser, because Babel strips type annotations
 * before ESLint can track their usage. @typescript-eslint/no-unused-vars would
 * handle this correctly, but it requires @typescript-eslint/parser (see above).
 * Coverage is provided instead by noUnusedLocals and noUnusedParameters in both
 * server/tsconfig.json and client/tsconfig.json — tsc --noEmit is the
 * authoritative unused-variable check for all TypeScript files in this project.
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
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    // no-unused-vars is disabled for .ts/.tsx files because:
    // 1. The Babel parser false-positives on `import type` usage.
    // 2. noUnusedLocals + noUnusedParameters in both tsconfig.json files
    //    provide equivalent enforcement via tsc --noEmit.
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'no-unused-vars': 'off',
    },
  },
];
