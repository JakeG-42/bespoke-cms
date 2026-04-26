import Link from "next/link";
import { GeneratedVisual } from "@/components/site/generated-visuals";
import { sectorModules } from "@/content/site";

export const metadata = {
  title: "Sectors | Eltronic",
  description:
    "Eltronic application sectors including agriculture, construction, logistics and industrial automation.",
};

export default function SectorsPage() {
  return (
    <main className="page">
      <section className="hero compact-hero">
        <div className="hero-copy">
          <p className="code-kicker">sectors.map</p>
          <h1>Control systems for real working environments.</h1>
          <p className="lede">
            The current Eltronic site already points to a wide sector spread.
            This page turns those signals into clear pathways for visitors.
          </p>
          <div className="actions">
            <Link className="button" href="/contact">
              Discuss your sector
            </Link>
            <Link className="button secondary" href="/solutions">
              View solutions
            </Link>
          </div>
        </div>
        <GeneratedVisual label="Generated sector map image" variant="sectors" />
      </section>

      <section className="section">
        <div className="sector-grid">
          {sectorModules.map((sector) => (
            <article className="sector-card" key={sector.title}>
              <span className="section-number">{sector.code}</span>
              <h2>{sector.title}</h2>
              <p>{sector.summary}</p>
              <div className="tag-row">
                {sector.examples.map((example) => (
                  <span className="tag" key={example}>
                    {example}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="cta-module">
          <div>
            <span className="section-number">sector.quote</span>
            <h2>Not seeing your exact application?</h2>
            <p>
              The site is quote-led by design. If the project involves
              machinery, operator interfaces, CANbus or control integration,
              it is worth starting a conversation.
            </p>
          </div>
          <Link className="button" href="/contact">
            Start an enquiry
          </Link>
        </div>
      </section>
    </main>
  );
}
