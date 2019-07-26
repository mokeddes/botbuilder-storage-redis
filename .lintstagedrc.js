module.exports = {
  '*.{json,js}': ['eslint --fix', 'git add'],
  '*.md': ['prettier --write', 'markdownlint', 'git add']
};
