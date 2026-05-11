import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PuckBuilderRenderer } from "@/components/payload/puck-builder-renderer";
import { SiteFooter } from "@/components/payload/site-footer";
import { getHelpCategoryPageData } from "@/lib/help-centre/articles";
import { siteConfig } from "@/lib/seo";

export const dynamic = "force-dynamic";

type HelpCategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export async function generateMetadata({ params }: HelpCategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const data = await getHelpCategoryPageData(category);

  if (!data.category) {
    return {
      title: "Help category",
      robots: {
        follow: false,
        index: false,
      },
    };
  }

  return {
    title: `${data.category.title} help`,
    description: data.category.description || data.category.intro || siteConfig.description,
  };
}

export default async function HelpCategoryPage({ params }: HelpCategoryPageProps) {
  const { category } = await params;
  const data = await getHelpCategoryPageData(category);

  if (!data.category) {
    notFound();
  }

  const helpCategory = data.category;

  return (
    <>
      {data.templateData ? (
        <PuckBuilderRenderer
          data={data.templateData}
          helpArticles={helpCategory.articles}
          helpCategory={helpCategory}
          menus={data.menus}
        />
      ) : data.headerData ? (
        <div className="help-category-header">
          <PuckBuilderRenderer data={data.headerData} menus={data.menus} showFooter={false} />
        </div>
      ) : null}
      {!data.templateData ? <main className="help-category-page">
        <section className="help-category-shell">
          <Link className="help-article-back" href="/help-centre">
            Back to Help Centre
          </Link>
          <p className="help-article-kicker">Help Centre</p>
          <h1>{helpCategory.title}</h1>
          {helpCategory.description || helpCategory.intro ? <p className="help-category-summary">{helpCategory.description || helpCategory.intro}</p> : null}

          <div className="help-category-article-grid">
            {helpCategory.articles.map((article) => (
              <Link className="help-category-article-card" href={article.path} key={article.path}>
                <span className="help-category-article-label">{helpCategory.heading}</span>
                <strong>{article.title}</strong>
                {article.summary ? <em>{article.summary}</em> : null}
                <small>Read article</small>
              </Link>
            ))}
          </div>
        </section>
      </main> : null}
      {!data.templateData ? <SiteFooter menus={data.menus} /> : null}
    </>
  );
}
