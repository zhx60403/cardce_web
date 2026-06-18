import React from "react";

export function PhoneShell({ className, children }) {
  return (
    <main className="audit-canvas">
      <section className={`screen-root ${className}`}>{children}</section>
    </main>
  );
}

export function FlowHeader({
  title,
  subtitle,
  barClassName = "add-region-top-bar",
  clusterClassName = "add-region-title-cluster",
}) {
  return (
    <header className={barClassName}>
      <div className={clusterClassName}>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </header>
  );
}

export function FlowProgress({ step, label, width }) {
  return (
    <div className="add-flow-progress-track" aria-label={`步骤 ${step}/5：${label}`}>
      <span className="add-flow-progress-fill" style={{ width: `${width}px` }} />
    </div>
  );
}

export function Dock({ active, navigate }) {
  return (
    <nav className="dock" aria-label="底部导航">
      <span className={`dock-active ${active === "stats" ? "stats" : "home"}`} />
      <a className={active === "home" ? "active" : ""} href="/" onClick={navigate("/")}>首页</a>
      <a className={active === "stats" ? "active" : ""} href="/stats" onClick={navigate("/stats")}>统计</a>
    </nav>
  );
}
