import Image from "next/image";

export function PlatformConsoleIcon() {
  return (
    <div className="platform-console-icon">
      <Image alt="" aria-hidden="true" height={64} src="/aevsiteicon.png" width={64} />
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
