module.exports = {
    hooks: {
        'pre-commit': 'npm run build',
        'commit-msg': 'npx commitlint -E HUSKY_GIT_PARAMS'
    }
};
