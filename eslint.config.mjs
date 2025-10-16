import config from 'eslint-config-dicodingacademy';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  config,
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
  },
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
]);
