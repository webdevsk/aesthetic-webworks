// @ts-check

import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import globals from "globals"
// import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"

export default tseslint.config(
    tseslint.configs.recommended,
    eslint.configs.recommended,
    {
        ignores: ["node_modules", "dist", "coverage", ".env", "drizzle/"],
        rules: {
            endOfLine: "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "warn",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "off"
        },
        languageOptions: {
            globals: {
                ...globals.node,
            }
        }
    },
    // eslintPluginPrettierRecommended
)
