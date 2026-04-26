export const metadata = {
  title: "About | Eltronic",
  description: "About Eltronic systems integration and machinery solutions.",
};

export default function AboutPage() {
  return (
    <main className="page">
      <section className="section">
        <p className="code-kicker">about.eltronic</p>
        <h1>Systems integration for machinery.</h1>
        <p className="lede">
          Eltronic AG Limited specialises in mobile and stationary machinery
          solutions: intelligent touch screens, custom harnesses, software and
          control-system integration.
        </p>
      </section>

      <section className="section">
        <div className="capability-grid">
          <article className="panel">
            <h3>HMI solutions</h3>
            <p>
              Rugged touch screen interfaces with CAN-Bus, Ethernet and serial
              communications for demanding operating environments.
            </p>
          </article>
          <article className="panel">
            <h3>Bespoke integration</h3>
            <p>
              Custom software and control-system integration around the needs
              of each project, machine and operator workflow.
            </p>
          </article>
          <article className="panel">
            <h3>Support and reliability</h3>
            <p>
              A product-led approach across agriculture, construction, mining,
              logistics and industrial automation.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
