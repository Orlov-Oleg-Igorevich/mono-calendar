import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import nx from '@nx/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: prettierPlugin,
      nx,
    },
  },
  {
    ignores: ['**/dist', 'node_modules', 'eslint.config.mjs'],
  },
  // Nx базовые конфиги
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: ['tsconfig.base.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    rules: {
      ...prettierPlugin.configs.recommended.rules,
      ...eslintConfigPrettier.rules,
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-unused-vars': ['off'],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': ['warn'],
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/require-default-init': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          useTabs: false,
          semi: true,
          trailingComma: 'all',
          bracketSpacing: true,
          printWidth: 100,
      },
    ]},
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
);
