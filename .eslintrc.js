module.exports = {
    'env': {
        'browser': true,
        'es6': true
    },
    'extends': 'eslint:recommended',
    'parser': 'babel-eslint',
    'parserOptions': {
        'ecmaVersion': 2018,
        'sourceType': 'module'
    },
    'plugins': [
        'babel',
    ],
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ],
        'comma-dangle': [
            'error',
            'only-multiline'
        ]
    }
}
