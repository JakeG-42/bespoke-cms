export function PlatformConsoleIcon() {
  return (
    <div aria-hidden="true" className="platform-console-icon">
      <span />
    </div>
  );
}

export function PlatformConsoleLogo() {
  return (
    <div className="platform-console-logo">
      <PlatformConsoleIcon />
      <div>
        <strong>Andersen EV</strong>
        <span>Help Centre Console</span>
      </div>
    </div>
  );
}

export function ConsoleLoginIntro() {
  return (
    <div className="console-login-intro">
      <p>Help Centre workspace</p>
      <h1>Welcome back</h1>
    </div>
  );
}
