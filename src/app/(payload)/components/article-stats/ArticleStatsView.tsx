import { getArticleStats } from "@/lib/help-centre/article-analytics";

export async function ArticleStatsView() {
  const rows = await getArticleStats();
  const totals = rows.reduce(
    (accumulator, row) => ({
      helpfulVotes: accumulator.helpfulVotes + row.helpfulVotes,
      notHelpfulVotes: accumulator.notHelpfulVotes + row.notHelpfulVotes,
      totalSeconds: accumulator.totalSeconds + row.totalSeconds,
      uniqueBrowsers: accumulator.uniqueBrowsers + row.uniqueBrowsers,
      views: accumulator.views + row.views,
    }),
    {
      helpfulVotes: 0,
      notHelpfulVotes: 0,
      totalSeconds: 0,
      uniqueBrowsers: 0,
      views: 0,
    },
  );

  return (
    <main className="article-stats-console">
      <header className="article-stats-header">
        <div>
          <p>Help Centre analytics</p>
          <h1>Article stats</h1>
        </div>
        <span>Anonymous per-browser tracking</span>
      </header>

      <section className="article-stats-summary" aria-label="Article analytics summary">
        <article>
          <span>Views</span>
          <strong>{totals.views.toLocaleString("en-GB")}</strong>
        </article>
        <article>
          <span>Browsers</span>
          <strong>{totals.uniqueBrowsers.toLocaleString("en-GB")}</strong>
        </article>
        <article>
          <span>Helpful</span>
          <strong>{totals.helpfulVotes.toLocaleString("en-GB")}</strong>
        </article>
        <article>
          <span>Not helpful</span>
          <strong>{totals.notHelpfulVotes.toLocaleString("en-GB")}</strong>
        </article>
        <article>
          <span>Total time</span>
          <strong>{formatSeconds(totals.totalSeconds)}</strong>
        </article>
      </section>

      <section className="article-stats-table-wrap" aria-label="Article analytics by article">
        {rows.length > 0 ? (
          <table className="article-stats-table">
            <thead>
              <tr>
                <th scope="col">Article</th>
                <th scope="col">Category</th>
                <th scope="col">Views</th>
                <th scope="col">Browsers</th>
                <th scope="col">Helpful</th>
                <th scope="col">Not helpful</th>
                <th scope="col">Avg time</th>
                <th scope="col">Total time</th>
                <th scope="col">Last viewed</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.articlePath}>
                  <td>
                    <a href={row.articlePath} rel="noreferrer" target="_blank">
                      {row.articleTitle}
                    </a>
                    <span>{row.articlePath}</span>
                  </td>
                  <td>{row.categorySlug}</td>
                  <td>{row.views.toLocaleString("en-GB")}</td>
                  <td>{row.uniqueBrowsers.toLocaleString("en-GB")}</td>
                  <td>
                    <span className="article-stats-score article-stats-score-positive">{row.helpfulVotes.toLocaleString("en-GB")}</span>
                  </td>
                  <td>
                    <span className="article-stats-score article-stats-score-negative">{row.notHelpfulVotes.toLocaleString("en-GB")}</span>
                  </td>
                  <td>{formatSeconds(row.averageSecondsPerView)}</td>
                  <td>{formatSeconds(row.totalSeconds)}</td>
                  <td>{formatDate(row.lastViewedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="article-stats-empty">
            <h2>No article stats yet</h2>
            <p>Stats will appear once published help articles are viewed.</p>
          </div>
        )}
      </section>
    </main>
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "Not viewed yet";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatSeconds(seconds: number) {
  if (seconds <= 0) {
    return "0s";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 1) {
    return `${remainingSeconds}s`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}
