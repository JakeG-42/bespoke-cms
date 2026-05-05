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
        <strong>Bespoke CMS</strong>
        <span>Console</span>
      </div>
    </div>
  );
}

export function ConsoleLoginIntro() {
  return (
    <div className="console-login-intro">
      <p>Admin workspace</p>
      <h1>Welcome back</h1>
    </div>
  );
}
