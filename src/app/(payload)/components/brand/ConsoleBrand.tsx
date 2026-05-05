export function EltronicConsoleIcon() {
  return (
    <div aria-hidden="true" className="eltronic-console-icon">
      <span />
    </div>
  );
}

export function EltronicConsoleLogo() {
  return (
    <div className="eltronic-console-logo">
      <EltronicConsoleIcon />
      <div>
        <strong>Eltronic</strong>
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
