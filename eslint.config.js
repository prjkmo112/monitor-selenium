// @ts-check
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['eslint.config.js', "rollup.config.js", "tsconfig.json"],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
            sourceType: 'module',
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        rules: {
            '@typescript-eslint/no-floating-promises': 'warn',
            '@typescript-eslint/no-unsafe-argument': 'warn',

            'prefer-const': 'error',
            'linebreak-style': 'off',
            'no-multiple-empty-lines': ['error', { max: 2 }],
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-var-requires': 'error',
            '@typescript-eslint/ban-ts-comment': 'warn',
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
            'indent': ['error', 4, {
                SwitchCase: 2,
                ignoredNodes: [
                    "ConditionalExpression",
                    "ConditionalExpression > *"
                ]
            }],
            'require-jsdoc': 'off',
            'max-len': ["warn", {
                "code": 130, "tabWidth": 4,
                "ignoreComments": true,
                "ignoreUrls": true,
                "ignoreStrings": true,
                "ignoreRegExpLiterals": true,
                "ignorePattern": "`[^`]+`(?:\\);)?$"
            }],
            'quotes': 'off',
            'object-curly-spacing': ["warn", "always"],
            'eol-last': ["warn", "never"],
            'guard-for-in': 'off',
            'curly': ['warn', 'multi-or-nest'],
            'camelcase': ['warn', {
                "ignoreImports": true,
                "ignoreGlobals": true,
                "properties": "never"
            }]
        },
    },
);