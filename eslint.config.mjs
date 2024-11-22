import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/legacy/**/*"],
}, ...fixupConfigRules(compat.extends(
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:storybook/recommended",
)), {
    plugins: {
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
        react: fixupPluginRules(react),
        "jsx-a11y": jsxA11Y,
        "react-hooks": fixupPluginRules(reactHooks),
        "simple-import-sort": simpleImportSort,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.jest,
        },

        parser: tsParser,
        ecmaVersion: 11,
        sourceType: "script",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },

            project: "./tsconfig.json",
        },
    },

    settings: {
        react: {
            pragma: "React",
            version: "detect",
        },
    },

    rules: {
        "no-console": "error",
        "import/first": "off",
        "react/react-in-jsx-scope": "off",
        "no-useless-escape": "off",
        "no-fallthrough": "off",
        "no-misleading-character-class": "off",
        "react/prop-types": "off",
        "react-hooks/exhaustive-deps": "off",
        "no-empty": "off",

        "no-multiple-empty-lines": ["error", {
            max: 2,
            maxBOF: 0,
        }],

        "eol-last": ["error", "always"],
        "newline-before-return": ["error"],

        indent: ["error", 4, {
            MemberExpression: 1,
            SwitchCase: 1,
        }],

        "simple-import-sort/exports": "error",

        "simple-import-sort/imports": ["error", {
            groups: [["^(fs)(/.*|$)"], [
                "^(react|redux|react-redux|react-dom|lodash|classnames)(/.*|$)",
                "^(@ag-grid-community|node-fetch)(/.*|$)",
            ], ["^(consts)(/.*|$)"], ["^(translations)(/.*|$)"], ["^(actions|reducers)(/.*|$)"], ["^(services)(/.*|$)"], ["^(sw|hooks|legacy|middlewares|routing|utils)(/.*|$)"], ["^(components)(/.*|$)"], ["^\\.\\.(?!/?$)", "^\\.\\./?$"], ["^.+\\.s?css$"]],
        }],

        "object-curly-spacing": ["error", "always"],
        "@typescript-eslint/no-empty-function": "off",

        "@typescript-eslint/naming-convention": ["error", {
            selector: "interface",
            format: ["PascalCase"],

            custom: {
                regex: "^I[A-Z]",
                match: true,
            },
        }],

        "@typescript-eslint/no-explicit-any": "off",
    },
}];