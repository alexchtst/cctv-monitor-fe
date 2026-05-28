import Link from "next/link";

type ActivePage = "Dashboard" | "Live View" | "Analytics" | "Violation Logs" | "Settings";

const navItems = [
  ["Dashboard", "/", "grid"],
  ["Live View", "/live", "camera"],
  ["Analytics", "/analytics", "chart"],
  ["Violation Logs", "/violations", "alert"],
  ["Settings", "/settings", "settings"],
] as const;

export function AppShell({
  active,
  children,
  searchPlaceholder,
}: Readonly<{
  active: ActivePage;
  children: React.ReactNode;
  searchPlaceholder: string;
}>) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand-block">
            <h1>K3 Vigilance</h1>
            <p>Site Alpha - Sector 7</p>
          </div>
          <nav className="side-nav" aria-label="Primary">
            {navItems.map(([label, href, icon]) => (
              <Link
                className={active === label ? "active" : ""}
                href={href}
                key={label}
              >
                <Icon name={icon} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="profile-card">
          <div className="avatar">{active === "Settings" ? "SO" : "BS"}</div>
          <div>
            <span>{active === "Settings" ? "SAFETY OFFICER" : "PETUGAS K3"}</span>
            <strong>{active === "Settings" ? "Admin Access" : "Budi Santoso"}</strong>
          </div>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="topbar-left">
            {active !== "Settings" && <strong>Industrial Safety AI</strong>}
            <label className="search-box">
              <Icon name="search" />
              <input placeholder={searchPlaceholder} />
            </label>
          </div>
          <div className="topbar-right">
            {active === "Settings" && (
              <strong className="topbar-product"><Icon name="shield" /> Industrial Safety AI</strong>
            )}
            <button aria-label="Notifications"><Icon name="bell" /></button>
            {active !== "Settings" && <button aria-label="Help"><Icon name="help" /></button>}
            <div className="top-avatar">AI</div>
          </div>
        </header>
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}

export function StatusFeed() {
  return (
    <div className="status-feed">
      <i />
      LIVE DATA FEED
    </div>
  );
}

export function Icon({ name }: { name: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  const paths: Record<string, React.ReactNode> = {
    alert: <path d="M12 3 2.7 20h18.6L12 3Zm0 6v5m0 4h.01" />,
    bell: <path d="M15 17H9m9-5a6 6 0 0 0-12 0c0 3-1 4-2 5h16c-1-1-2-2-2-5Zm-6 8a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Z" />,
    camera: <path d="M4 8h4l2-3h4l2 3h4v10H4V8Zm8 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
    chart: <path d="M4 19V5m0 14h16M8 16v-5m4 5V8m4 8v-3" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    copy: <path d="M9 9h9v11H9zM6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />,
    download: <path d="M12 3v10m0 0 4-4m-4 4-4-4M5 17v3h14v-3" />,
    grid: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
    help: <path d="M12 18h.01M9.5 9a2.7 2.7 0 1 1 4.2 2.2c-.9.6-1.7 1.2-1.7 2.8M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    image: <path d="M4 5h16v14H4zM8 13l2.5-3 3.5 5 2-2 3 4M8 8h.01" />,
    info: <path d="M12 17v-6m0-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    mail: <path d="M4 6h16v12H4zM4 7l8 6 8-6" />,
    plus: <path d="M12 5v14M5 12h14" />,
    save: <path d="M5 3h12l2 2v16H5zM8 3v6h8M8 21v-7h8v7" />,
    search: <path d="m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />,
    settings: <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a8 8 0 0 0-1.8-1L14.4 3h-4.8l-.4 3.1a8 8 0 0 0-1.8 1l-2.4-1-2 3.4L5 11a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a8 8 0 0 0 1.8 1l.4 3.1h4.8l.4-3.1a8 8 0 0 0 1.8-1l2.4 1 2-3.4-2-1.5a7 7 0 0 0 .1-1Z" />,
    shield: <path d="M12 3 5 6v5c0 4.3 2.7 8.2 7 10 4.3-1.8 7-5.7 7-10V6l-7-3Z" />,
    x: <path d="m6 6 12 12M18 6 6 18" />,
  };

  return (
    <svg className="icon" {...common}>
      {paths[name] ?? paths.grid}
    </svg>
  );
}
