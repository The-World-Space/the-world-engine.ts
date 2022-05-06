module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "jest": true
    },
    "globals": {
        "page": true,
        "browser": true,
        "context": true,
        "jestPuppeteer": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "ignorePatterns": [
        "**/box2d.ts/*"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 13,
        "sourceType": "module",
        "project": "./tsconfig.json"
    },
    "plugins": [
        "@typescript-eslint",
        "jest"
    ],
    "rules": {
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/explicit-member-accessibility": [
            "error",
            {
                "accessibility": "explicit",
                "overrides": {
                    "accessors": "explicit",
                    "constructors": "explicit",
                    "methods": "explicit",
                    "properties": "explicit",
                    "parameterProperties": "explicit"
                }
            }
        ],
        "@typescript-eslint/prefer-readonly": ["error"],
        "@typescript-eslint/explicit-function-return-type": ["error"],
        "@typescript-eslint/array-type": ["error"],
        "@typescript-eslint/brace-style": [
            "error",
            "1tbs"
        ],
        "@typescript-eslint/prefer-includes": ["error"],
        "@typescript-eslint/space-before-blocks": ["error"],
        "@typescript-eslint/type-annotation-spacing": [
            "error",
            {
                "before": false,
                "after": true,
                "overrides": {
                    "arrow": {
                        "before": true,
                        "after": true
                    }
                }
            }
        ],
        "@typescript-eslint/naming-convention": [
            "error",
            {
                "selector": "variableLike",
                "format": ["camelCase"]
            },
            {
                "selector": "memberLike",
                "modifiers": ["private"],
                "format": ["camelCase"]
            },
            {
                "selector": "memberLike",
                "modifiers": ["public"],
                "format": ["camelCase"]
            },
            {
                "selector": "property",
                "modifiers": ["private"],
                "format": ["camelCase"],
                "leadingUnderscore": "require"
            },
            {
                "selector": "property",
                "modifiers": ["public"],
                "format": ["camelCase"]
            },
            {
                "selector": "parameter",
                "format": ["camelCase"],
                "leadingUnderscore": "allow"
            },
            {
                "selector": "class",
                "format": ["PascalCase"]
            },
            {
                "selector": "interface",
                "format": ["PascalCase"]
            },
            {
                "selector": "enum",
                "format": ["PascalCase"]
            }
        ],
        "no-debugger": "warn",
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "comma-dangle": [
            "error",
            "never"
        ],
    },
    "settings": {
        "import/resolver": {
            alias: {
                map: [
                    ['src', './src']
                ]
            }
        }
    }
};
