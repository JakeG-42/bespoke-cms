"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";

import type { BuilderHelpArticle, BuilderHelpCategory } from "@/payload/builder/types";

type HelpCentreSearchProps = {
  articles: BuilderHelpArticle[];
  categories?: BuilderHelpCategory[];
  internalLinkBasePath?: string;
};

type SearchResult = {
  article: BuilderHelpArticle;
  categoryTitle: string;
  href: string;
  score: number;
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function words(value: string) {
  return normalize(value).split(/\s+/).filter(Boolean);
}

function editDistance(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 2) {
    return 3;
  }

  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);

  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = i - 1;
    previous[0] = i;

    for (let j = 1; j <= b.length; j += 1) {
      const current = previous[j];
      previous[j] =
        a[i - 1] === b[j - 1]
          ? diagonal
          : Math.min(previous[j - 1] + 1, previous[j] + 1, diagonal + 1);
      diagonal = current;
    }
  }

  return previous[b.length] ?? 3;
}

function withBasePath(path: string, internalLinkBasePath = "") {
  const basePath = internalLinkBasePath.replace(/\/+$/, "");

  if (!basePath || path.startsWith("#") || path.startsWith("//") || /^[a-z][a-z0-9+.-]*:/i.test(path)) {
    return path;
  }

  if (path === "/") {
    return basePath;
  }

  if (path === basePath || path.startsWith(`${basePath}/`)) {
    return path;
  }

  return path.startsWith("/") ? `${basePath}${path}` : path;
}

function scoreArticle(article: BuilderHelpArticle, categoryTitle: string, query: string) {
  const search = normalize(query);

  if (!search) {
    return 0;
  }

  const queryWords = words(query);
  const title = normalize(article.title);
  const summary = normalize(article.summary ?? "");
  const category = normalize(categoryTitle || article.sectionHeading || "");
  const body = normalize(article.body ?? "");
  const titleWords = words(article.title);
  let score = 0;

  if (title === search) score += 80;
  if (title.startsWith(search)) score += 48;
  if (title.includes(search)) score += 34;
  if (summary.includes(search)) score += 18;
  if (category.includes(search)) score += 14;
  if (body.includes(search)) score += 8;

  queryWords.forEach((word) => {
    if (titleWords.some((titleWord) => titleWord === word)) score += 18;
    else if (titleWords.some((titleWord) => titleWord.startsWith(word))) score += 12;
    else if (titleWords.some((titleWord) => titleWord.includes(word) || editDistance(word, titleWord) <= 2)) score += 7;

    if (summary.includes(word)) score += 5;
    if (category.includes(word)) score += 4;
    if (body.includes(word)) score += 2;
  });

  return score;
}

export function HelpCentreSearch({ articles, categories = [], internalLinkBasePath = "" }: HelpCentreSearchProps) {
  const [query, setQuery] = useState("");
  const categoryTitles = useMemo(() => new Map(categories.map((category) => [category.slug, category.title])), [categories]);
  const results = useMemo<SearchResult[]>(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      return [];
    }

    return articles
      .map((article) => {
        const categoryTitle = categoryTitles.get(article.categorySlug) ?? article.sectionHeading ?? "";

        return {
          article,
          categoryTitle,
          href: withBasePath(article.path, internalLinkBasePath),
          score: scoreArticle(article, categoryTitle, trimmedQuery),
        };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.article.title.localeCompare(b.article.title))
      .slice(0, 6);
  }, [articles, categoryTitles, internalLinkBasePath, query]);

  const showResults = query.trim().length >= 2;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (results[0]) {
      window.location.href = results[0].href;
    }
  }

  return (
    <form aria-label="Search help centre" className="puck-help-category-search-shell" role="search" onSubmit={handleSubmit}>
      <div className="puck-help-category-search">
        <Search aria-hidden="true" size={20} strokeWidth={2} />
        <input
          aria-label="Search help centre"
          autoComplete="off"
          placeholder="Search the help centre"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {showResults ? (
        <div className="puck-help-search-results" aria-label="Search results">
          {results.length ? (
            results.map((result) => (
              <a className="puck-help-search-result" href={result.href} key={result.article.path}>
                <span>{result.categoryTitle || "Help Centre"}</span>
                <strong>{result.article.title}</strong>
                {result.article.summary ? <em>{result.article.summary}</em> : null}
                <ArrowRight aria-hidden="true" size={16} strokeWidth={2} />
              </a>
            ))
          ) : (
            <p className="puck-help-search-empty">No close article matches found.</p>
          )}
        </div>
      ) : null}
    </form>
  );
}
