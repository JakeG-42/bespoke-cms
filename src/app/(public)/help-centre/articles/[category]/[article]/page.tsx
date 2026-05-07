import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PuckBuilderRenderer } from "@/components/payload/puck-builder-renderer";
import { getHelpCategoryPath } from "@/lib/help-centre/article-routing";
import { getHelpArticlePageData } from "@/lib/help-centre/articles";
import { siteConfig } from "@/lib/seo";

export const dynamic = "force-dynamic";

type HelpArticlePageProps = {
  params: Promise<{
    article: string;
    category: string;
  }>;
};

export async function generateMetadata({ params }: HelpArticlePageProps): Promise<Metadata> {
  const { article, category } = await params;
  const data = await getHelpArticlePageData(category, article);

  if (!data.article) {
    return {
      title: "Help article",
      robots: {
        follow: false,
        index: false,
      },
    };
  }

  return {
    title: data.article.title,
    description: data.article.summary || siteConfig.description,
  };
}

export default async function HelpArticlePage({ params }: HelpArticlePageProps) {
  const { article, category } = await params;
  const data = await getHelpArticlePageData(category, article);

  if (!data.article) {
    notFound();
  }

  return (
    <>
      {data.headerData ? (
        <div className="help-article-header">
          <PuckBuilderRenderer data={data.headerData} featuredProducts={[]} menus={data.menus} />
        </div>
      ) : null}
      <main className="help-article-page">
        <article className="help-article-shell">
          <Link className="help-article-back" href={getHelpCategoryPath(data.article.categorySlug)}>
            Back to {data.article.sectionHeading}
          </Link>
          <p className="help-article-kicker">{data.article.sectionHeading}</p>
          <h1>{data.article.title}</h1>
          {data.article.summary ? <p className="help-article-summary">{data.article.summary}</p> : null}
          <div className="help-article-body">{renderArticleBody(data.article.body)}</div>
          {data.article.sourceUrl ? (
            <a className="help-article-source" href={data.article.sourceUrl} rel="noreferrer" target="_blank">
              Source reference
            </a>
          ) : null}
        </article>
      </main>
    </>
  );
}

function renderArticleBody(body: string) {
  const chunks = publicArticleChunks(body);

  if (!chunks.length) {
    return <p>Article content is being prepared.</p>;
  }

  return chunks.map((chunk, index) => {
    const lines = chunk
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const isList = lines.length > 1 && lines.every((line) => line.startsWith("- "));

    if (isList) {
      return (
        <ul key={`${chunk.slice(0, 12)}-${index}`}>
          {lines.map((line) => (
            <li key={line}>{line.replace(/^- /, "")}</li>
          ))}
        </ul>
      );
    }

    return <p key={`${chunk.slice(0, 12)}-${index}`}>{lines.join(" ")}</p>;
  });
}

function publicArticleChunks(body: string) {
  const chunks = body
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  return chunks.filter((chunk) => !isInternalArticleNote(chunk));
}

function isInternalArticleNote(chunk: string) {
  return /^(needs andersen confirmation|publication warning|recommended asset|recommended page note|recommended support detail|migration note|content gaps|suggested review owners)/i.test(
    chunk,
  );
}
