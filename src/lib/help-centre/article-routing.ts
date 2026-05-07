export function slugifyHelpArticle(value: string | undefined) {
  const slug = (value ?? "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);

  return slug || "article";
}

export function getHelpArticlePath(category: string | undefined, title: string | undefined) {
  return `/help-centre/articles/${slugifyHelpArticle(category)}/${slugifyHelpArticle(title)}`;
}

export function getHelpCategoryPath(category: string | undefined) {
  return `/help-centre/${slugifyHelpArticle(category)}`;
}
