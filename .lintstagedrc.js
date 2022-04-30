module.exports = {
  '*.{ts,js,tsx,jsx}': ['eslint --fix', 'jest --coverage --findRelatedTests --passWithNoTests', 'git add'],
  '*.md': ['prettier --write', 'markdownlint', 'git add']
};
