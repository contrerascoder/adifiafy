module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "plugin:flowtype/recommended",
        "plugin:flowtype-errors/recommended",
        "plugin:vue/base",
        'plugin:vue/recommended',
        "plugin:sonarjs/recommended",
        "google"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
        "alertify": "readonly",
        "io": "readonly"
    },
    "parserOptions": {
        "parser": "babel-eslint",
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "vue",
        "flowtype",
        "sonarjs"
    ],
    "rules": {
        "flowtype/no-types-missing-file-annotation": 0,
        semi: ['error', "never"],
        indent: ['error', 4],
        quotes: ["error", "backtick"],
        'no-console': ["warn", { allow: ["warn", "error"] }],
        'max-len': "off",
        'no-undef': 'error',
        'linebreak-style': 'off'
    }
};