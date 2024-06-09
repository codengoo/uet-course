import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
    {
        languageOptions: { globals: globals.browser },
        ignores: ['node_modules/*'],
    },
    ...tseslint.configs.recommended,
];
