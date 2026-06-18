import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import "./styles.css";

const routeOrder = { home: 0, addRegion: 1, detail: 2, stats: 3 };

const transactions = [
  ["Starbucks", "餐饮 · 今天", "HKD 68", "返现 5.03"],
  ["Deliveroo", "餐饮 · 今天", "HKD 185", "返现 13.69"],
  ["HKTVmall", "网上消费 · 今天", "HKD 1,280", "返现 51.20"],
];

function getRoute(pathname) {
  if (pathname.startsWith("/cards/new/region")) return "addRegion";
  if (pathname.startsWith("/cards/pulse")) return "detail";
  if (pathname.startsWith("/stats")) return "stats";
  return "home";
}

function PhoneShell({ className, children }) {
  return (
    <main className="audit-canvas">
      <section className={`screen-root ${className}`}>{children}</section>
    </main>
  );
}

function CardPageContent({ navigate }) {
  return (
    <>
      <header className="cards-top-bar">
        <div className="cards-title-cluster">
          <h1>卡片</h1>
          <p>3 张卡 · 本月表现实时更新</p>
        </div>
        <a className="cards-add-button" href="/cards/new/region" aria-label="新增卡片" onClick={navigate("/cards/new/region")}>+</a>
      </header>

      <section className="cards-stack" aria-label="信用卡堆叠">
        <article className="bank-card smart-card">
          <div className="card-reflection" />
          <span className="bank-name">Standard Chartered</span>
          <span className="chip empty" />
          <strong>Smart Card</strong>
          <em>本月 HKD 93.62</em>
          <small>•••• 2468</small>
          <b>5%</b>
          <i>VISA</i>
        </article>
        <article className="bank-card red-card">
          <div className="card-reflection" />
          <span className="bank-name">HSBC</span>
          <span className="chip empty" />
          <strong>Red Card</strong>
          <em>本月 HKD 158.20</em>
          <small>•••• 1357</small>
          <b>4%</b>
          <i>VISA</i>
        </article>
        <a className="detail-card-link" href="/cards/pulse" aria-label="查看 Pulse Card 单卡详情" onClick={navigate("/cards/pulse")}>
          <article className="bank-card pulse-card">
            <div className="card-edge top" />
            <div className="card-edge bottom" />
            <div className="card-glow-left" />
            <div className="card-glow-right" />
            <div className="card-micro" />
            <span className="bank-name">HSBC</span>
            <span className="chip"><span /></span>
            <strong>Pulse Card</strong>
            <em>预计 HKD 486.32</em>
            <small>•••• 8821</small>
            <b>7.4%</b>
            <span className="network-dot a" />
            <span className="network-dot b" />
            <i>VISA</i>
          </article>
        </a>
      </section>

      <section className="cards-summary-panel">
        <h2>当前聚焦卡片</h2>
        <strong>本月预计返现：HKD 486.32</strong>
        <p>Pulse Card 本月预计 HKD 486.32，餐饮与线上消费贡献最高。</p>
      </section>

      <section className="cards-rule-panel">
        <div className="cards-rule-head">
          <b>提醒</b>
          <strong>额度接近</strong>
        </div>
        <p>餐饮高返现额度仅剩 HKD 540 · 网上消费 5 天后重置</p>
        <div className="cards-progress"><span /></div>
      </section>

      <section className="cards-recent-panel">
        <h2>最近 3 笔交易</h2>
        {transactions.map((item) => <TransactionRow key={item[0]} item={item} />)}
      </section>
    </>
  );
}

function StatsPageContent() {
  return (
    <>
      <header className="stats-top-bar">
        <div className="stats-title-cluster">
          <h1>统计分析</h1>
          <p>这个月赚到了多少，一眼看懂</p>
        </div>
      </header>

      <section className="stats-hero" aria-label="本月返现摘要">
        <span className="stats-aura stats-aura-liquid" />
        <span className="stats-aura stats-aura-achievement" />
        <p className="hero-label">本月总 cashback</p>
        <strong className="hero-amount">HKD 486</strong>
        <p className="hero-milestone">年度 cashback 已突破<br />HKD 3,000</p>
        <p className="hero-comparison">比上月 +12.4% · 表现很漂亮</p>
        <div className="stat-pill annual-pill"><span>年度累计</span><b>HKD 3,182</b></div>
        <div className="stat-pill rate-pill"><span>平均返现率</span><b>2.61%</b></div>
        <div className="emoji-glow" />
        <div className="emoji-face">
          <span className="emoji-eye eye-left" />
          <span className="emoji-eye eye-right" />
          <span className="emoji-mouth">⌣</span>
        </div>
        <span className="spark sparkle-one" />
        <span className="spark sparkle-two" />
        <span className="spark sparkle-three" />
        <div className="hero-popover">
          <b>Pulse Card 为你贡献了本月最多的 cashback。</b>
          <span>再使用 HKD 540 餐饮额度，就能充分利用本月高返现。</span>
        </div>
      </section>

      <section className="stats-panel contribution-panel" aria-label="贡献来源">
        <h2>贡献来源</h2>
        <div className="metric-row metric-card"><b>Pulse Card</b><strong>HKD 318</strong></div>
        <div className="track card-track"><span /></div>
        <div className="metric-row metric-category"><b>餐饮与线上消费</b><strong>66%</strong></div>
        <div className="track category-track"><span /></div>
      </section>

      <section className="stats-panel trend-panel" aria-label="月度趋势">
        <h2>月度趋势</h2>
        <p>连续 3 个月提升，本月比上月多 HKD 54</p>
        <strong className="milestone-badge">里程碑</strong>
        <span className="milestone-dot" />
        <span className="bar apr" />
        <span className="bar may" />
        <span className="bar jun" />
      </section>

      <section className="stats-panel advice-panel" aria-label="行动建议">
        <h2>行动建议</h2>
        <p>再使用 HKD 540 餐饮额度，就能充分利用本月高返现。</p>
      </section>
    </>
  );
}

const hotRegions = [
  { label: "中国香港", className: "hong-kong" },
  { label: "新加坡", className: "singapore" },
  { label: "日本", className: "japan" },
];

const allRegions = [
  { label: "中国香港", selected: true },
  { label: "中国内地" },
  { label: "新加坡" },
  { label: "日本" },
  { label: "美国" },
];

const addCardSteps = ["选择地区", "选择银行", "选择卡产品", "确认卡片并设置账单信息", "新增成功"];

const bankOptions = [
  { name: "HSBC", count: "6 款信用卡产品", color: "#d81f2a" },
  { name: "Standard Chartered", count: "4 款信用卡产品", color: "#1b7f54" },
  { name: "Citi", count: "5 款信用卡产品", color: "#1b5fbf" },
  { name: "DBS", count: "3 款信用卡产品", color: "#d23b3b" },
  { name: "BOC Hong Kong", count: "4 款信用卡产品", color: "#b91c32" },
  { name: "American Express", count: "2 款信用卡产品", color: "#2e6f9e" },
];

const productOptions = [
  {
    id: "pulse",
    bank: "HSBC",
    name: "Pulse Card",
    meta: "HKD / VISA",
    cashback: "7.4% 餐饮与线上 cashback",
    limit: "额度摘要：额外 5% 剩余 HKD 540",
    color: "#087b72",
    variant: "featured",
  },
  {
    id: "red",
    name: "HSBC Red Card",
    meta: "HKD / Mastercard",
    cashback: "4% dining cashback · 月额度 HKD 1,000",
    color: "#8e2f47",
  },
  {
    id: "signature",
    name: "Visa Signature",
    meta: "HKD / VISA",
    cashback: "旅行与海外消费 3% · 月额度 HKD 3,000",
    color: "#11324d",
  },
];

const confirmFields = [
  { label: "卡号尾号", value: "8821" },
  { label: "备注", value: "日常餐饮" },
  { label: "账单日", value: "每月 18 日" },
  { label: "还款日", value: "每月 8 日" },
];

function AddCardFlowPage({ navigate }) {
  const [step, setStep] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState("中国香港");
  const [selectedBank, setSelectedBank] = useState("HSBC");
  const [selectedProduct, setSelectedProduct] = useState("pulse");
  const currentStep = addCardSteps[step];
  const progressWidth = (step + 1) * 69;
  const stepClass = step === 0 ? "region-step" : step === 1 ? "bank-step" : step === 2 ? "product-step" : step === 3 ? "confirm-step" : "success-step";
  const isSuccessStep = step === 4;

  return (
    <PhoneShell className={`add-card-flow-page ${stepClass}`}>
      <header className="add-region-top-bar">
        <div className="add-region-title-cluster">
          <h1>{isSuccessStep ? "Cardce" : "新增卡"}</h1>
          <p>{currentStep}</p>
        </div>
      </header>

      <button className="add-flow-close-button" type="button" aria-label="关闭并返回首页" onClick={navigate("/")}>
        ×
      </button>

      <div className="add-flow-progress-track" aria-label={`步骤 ${step + 1}/5：${currentStep}`}>
        <span className="add-flow-progress-fill" style={{ width: `${progressWidth}px` }} />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          className="add-step-transition-layer"
          initial={{ opacity: 0, x: step === 0 ? -18 : 18, filter: "blur(6px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: step === 0 ? 18 : -18, filter: "blur(6px)" }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {step === 0 ? (
            <RegionStep selectedRegion={selectedRegion} onSelectRegion={setSelectedRegion} />
          ) : null}
          {step === 1 ? (
            <BankStep selectedRegion={selectedRegion} selectedBank={selectedBank} onSelectBank={setSelectedBank} />
          ) : null}
          {step === 2 ? (
            <ProductStep selectedProduct={selectedProduct} onSelectProduct={setSelectedProduct} />
          ) : null}
          {step === 3 ? <ConfirmDetailsStep /> : null}
          {step === 4 ? <SuccessStep /> : null}
        </motion.div>
      </AnimatePresence>

      {step > 0 && !isSuccessStep ? (
        <button className="add-flow-bottom-button back" type="button" aria-label="返回上一步" onClick={() => setStep(step - 1)}>
          ←
        </button>
      ) : null}
      <button
        className={`add-flow-bottom-button ${isSuccessStep ? "done" : "next"}`}
        type="button"
        aria-label={isSuccessStep ? "确定并返回首页" : "下一步"}
        onClick={isSuccessStep ? navigate("/") : () => setStep(Math.min(step + 1, 4))}
      >
        {isSuccessStep ? "✓" : "→"}
      </button>
    </PhoneShell>
  );
}

function RegionStep({ selectedRegion, onSelectRegion }) {
  return (
    <>
      <div className="region-search-field" role="search">
        <span>搜索地区</span>
      </div>
      <section className="hot-region-section" aria-label="热门地区">
        <h2>热门地区</h2>
        <div className="hot-region-list">
          {hotRegions.map((region) => (
            <button
              className={`hot-region-chip ${region.className} ${selectedRegion === region.label ? "selected" : ""}`}
              key={region.label}
              type="button"
              aria-pressed={selectedRegion === region.label ? "true" : "false"}
              onClick={() => onSelectRegion(region.label)}
            >
              {region.label}
            </button>
          ))}
        </div>
      </section>

      <section className="all-region-section" aria-label="所有地区">
        <h2>所有地区</h2>
        <div className="region-row-list">
          {allRegions.map((region) => (
            <button
              className={`region-row ${selectedRegion === region.label ? "selected" : ""}`}
              key={region.label}
              type="button"
              aria-pressed={selectedRegion === region.label ? "true" : "false"}
              onClick={() => onSelectRegion(region.label)}
            >
              <span>{region.label}</span>
              {selectedRegion === region.label ? <b aria-hidden="true">✓</b> : null}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

function BankStep({ selectedRegion, selectedBank, onSelectBank }) {
  return (
    <>
      <p className="bank-region-hint">已根据 {selectedRegion} 加载银行</p>
      <div className="bank-search-field" role="search">
        <span>搜索银行</span>
      </div>
      <section className="bank-list" aria-label="银行列表">
        {bankOptions.map((bank, index) => (
          <button
            className={`bank-row ${selectedBank === bank.name ? "selected" : ""}`}
            key={bank.name}
            type="button"
            aria-pressed={selectedBank === bank.name ? "true" : "false"}
            style={{ top: `${index * 82}px` }}
            onClick={() => onSelectBank(bank.name)}
          >
            <span className="bank-logo" style={{ background: bank.color }} />
            <strong>{bank.name}</strong>
            <em>{bank.count}</em>
            {selectedBank === bank.name ? <b aria-hidden="true">✓</b> : null}
          </button>
        ))}
      </section>
    </>
  );
}

function ProductStep({ selectedProduct, onSelectProduct }) {
  return (
    <section className="product-selection-surface" aria-label="选择卡产品">
      <p className="product-selection-helper">选择一张要加入卡包的数字卡</p>
      <div className="product-option-list">
        {productOptions.map((product) => {
          const selected = selectedProduct === product.id;
          return (
            <button
              className={`product-option ${product.variant === "featured" ? "featured" : "compact"} ${selected ? "selected" : ""}`}
              key={product.id}
              type="button"
              aria-pressed={selected ? "true" : "false"}
              onClick={() => onSelectProduct(product.id)}
            >
              <span className="product-thumbnail" style={{ background: product.color }}>
                {product.variant === "featured" ? (
                  <>
                    <span className="product-thumbnail-chip" />
                    <span className="product-thumbnail-reflection" />
                  </>
                ) : null}
              </span>
              {product.bank ? <span className="product-bank">{product.bank}</span> : null}
              <strong>{product.name}</strong>
              <em>{product.meta}</em>
              <span className="product-cashback">{product.cashback}</span>
              {product.limit ? <span className="product-limit">{product.limit}</span> : null}
              {selected ? <b aria-hidden="true">✓</b> : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ConfirmDetailsStep() {
  return (
    <>
      <section className="confirm-card-face" aria-label="Pulse Card">
        <span className="confirm-card-reflection" />
        <span className="confirm-card-chip" />
        <span className="confirm-card-bank">HSBC</span>
        <strong className="confirm-card-name">Pulse Card</strong>
        <span className="confirm-card-cashback">本月 HKD 234.50</span>
        <span className="confirm-card-last4">•••• 8821</span>
        <b className="confirm-card-rate">7.4%</b>
        <i className="confirm-card-network">VISA</i>
      </section>

      <section className="confirm-details-surface" aria-label="卡片详细信息">
        <h2>卡片信息</h2>
        <div className="confirm-field-grid">
          {confirmFields.map((field) => (
            <button className="confirm-field" type="button" key={field.label}>
              <span>{field.label}</span>
              <strong>{field.value}</strong>
            </button>
          ))}
        </div>
        <div className="confirm-rules-summary">
          <h3>默认 cashback 规则</h3>
          <p>基础 2.4% 无上限<br />餐饮/线上额外 5%，月额度 HKD 2,000</p>
          <small>规则更新时间：2026-06-17 09:30</small>
        </div>
      </section>
    </>
  );
}

function SuccessStep() {
  return (
    <section className="success-wallet-surface" aria-label="添加成功">
      <h2>已加入卡包</h2>
      <p className="success-wallet-hint">新卡缩放进入卡堆，旧卡自然让出位置</p>
      <div className="success-card-stack" aria-hidden="true">
        <span className="success-old-card back" />
        <span className="success-old-card middle" />
        <span className="success-new-card-glow" />
        <span className="success-new-card">
          <span className="success-new-reflection" />
          <span className="success-new-chip" />
          <span className="success-new-bank">HSBC</span>
          <strong>Pulse Card</strong>
          <b>7.4%</b>
        </span>
        <span className="success-motion-trail" />
      </div>
      <div className="success-toast">Pulse Card 已加入卡包</div>
      <p className="success-auto-return-hint">自动回到卡片页 · 聚焦新卡</p>
    </section>
  );
}

function CardDetailPage() {
  const metrics = [
    ["本月消费", "18.6k"],
    ["平均返现", "2.61%"],
    ["年度累计", "3,182"],
    ["单卡统计", "查看"],
  ];

  return (
    <PhoneShell className="detail-page">
      <header className="detail-top-bar">
        <div className="detail-title-cluster">
          <h1>Pulse Card</h1>
          <p>单卡详情</p>
        </div>
      </header>

      <section className="detail-hero-card" aria-label="Pulse Card">
        <div className="detail-reflection" />
        <div className="detail-ambient" />
        <div className="detail-micro" />
        <div className="detail-edge" />
        <div className="detail-transition-anchor" />
        <span className="detail-bank">HSBC</span>
        <span className="detail-chip">
          <span className="detail-chip-inset" />
          <span className="detail-chip-v" />
          <span className="detail-chip-h" />
        </span>
        <strong className="detail-card-name">Pulse Card</strong>
        <em className="detail-cashback">预计 HKD 486.32</em>
        <small className="detail-last4">•••• 8821</small>
        <b className="detail-rate">7.4%</b>
        <i className="detail-network">VISA</i>
        <span className="detail-network-dot dot-a" />
        <span className="detail-network-dot dot-b" />
      </section>

      <section className="detail-metric-strip" aria-label="核心指标">
        {metrics.map(([label, value]) => (
          <div className="detail-metric" key={label}>
            <span>{label}<br />{value}</span>
          </div>
        ))}
      </section>

      <DetailRule
        className="cashback-rule"
        title="本月预计 cashback"
        value="HKD 486"
        meta="本月消费 HKD 18,620 · 平均返现率 2.61%"
      />
      <DetailRule
        className="quota-rule"
        title="返现额度 · 返现规则"
        value="剩 540"
        meta="额外 5%：餐饮 / 线上消费 · 月额度 HKD 2,000"
      />

      <section className="detail-transactions">
        <h2>全部交易</h2>
        {transactions.map((item) => <TransactionRow key={item[0]} item={item} />)}
      </section>
    </PhoneShell>
  );
}

function TransactionRow({ item }) {
  return (
    <div className="transaction-row">
      <div className="merchant-icon" />
      <div className="transaction-text">
        <b>{item[0]}</b>
        <span>{item[1]}</span>
      </div>
      <div className="transaction-amount">
        <b>{item[2]}</b>
        <span>{item[3]}</span>
      </div>
    </div>
  );
}

function DetailRule({ className, title, value, meta }) {
  return (
    <section className={`detail-rule-card ${className}`}>
      <div className="detail-rule-head">
        <b>{title}</b>
        <strong>{value}</strong>
      </div>
      <p>{meta}</p>
      <div className="detail-progress"><span /></div>
    </section>
  );
}

function Dock({ active, navigate }) {
  return (
    <nav className="dock" aria-label="底部导航">
      <span className={`dock-active ${active === "stats" ? "stats" : "home"}`} />
      <a className={active === "home" ? "active" : ""} href="/" onClick={navigate("/")}>首页</a>
      <a className={active === "stats" ? "active" : ""} href="/stats" onClick={navigate("/stats")}>统计</a>
    </nav>
  );
}

function HomeStatsShell({ route, direction, prefersReducedMotion, navigate }) {
  const active = route === "stats" ? "stats" : "home";

  return (
    <PhoneShell className={route === "stats" ? "stats-page" : "cards-page"}>
      <AnimatePresence mode="wait" initial={false} custom={{ direction, prefersReducedMotion }}>
        <motion.div
          key={route}
          className="tab-content-transition-layer"
          custom={{ direction, prefersReducedMotion }}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: prefersReducedMotion ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}
        >
          {route === "stats" ? <StatsPageContent /> : <CardPageContent navigate={navigate} />}
        </motion.div>
      </AnimatePresence>
      <Dock active={active} navigate={navigate} />
    </PhoneShell>
  );
}

function App() {
  useViewportScale();
  const prefersReducedMotion = useReducedMotion();
  const [route, setRoute] = useState(() => getRoute(window.location.pathname));
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const handlePopState = () => {
      const nextRoute = getRoute(window.location.pathname);
      setDirection(routeOrder[nextRoute] - routeOrder[route]);
      setRoute(nextRoute);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [route]);

  const navigate = (to) => (event) => {
    if (event) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
    }

    if (window.location.pathname === to) return;
    const nextRoute = getRoute(to);
    setDirection(routeOrder[nextRoute] - routeOrder[route]);
    window.history.pushState({}, "", to);
    setRoute(nextRoute);
  };

  if (route === "home" || route === "stats") {
    return (
      <HomeStatsShell
        route={route}
        direction={direction}
        prefersReducedMotion={prefersReducedMotion}
        navigate={navigate}
      />
    );
  }

  const fullPage = route === "addRegion" ? <AddCardFlowPage navigate={navigate} /> : <CardDetailPage />;

  return (
    <AnimatePresence mode="wait" initial={false} custom={{ direction, prefersReducedMotion }}>
      <motion.div
        key={route}
        className="page-transition-layer"
        custom={{ direction, prefersReducedMotion }}
        variants={pageVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: prefersReducedMotion ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}
      >
        {fullPage}
      </motion.div>
    </AnimatePresence>
  );
}

const pageVariants = {
  enter: ({ direction, prefersReducedMotion }) => ({
    opacity: prefersReducedMotion ? 1 : 0,
    x: prefersReducedMotion ? 0 : Math.sign(direction || 1) * 34,
    scale: prefersReducedMotion ? 1 : 0.985,
    filter: prefersReducedMotion ? "none" : "blur(8px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: ({ direction, prefersReducedMotion }) => ({
    opacity: prefersReducedMotion ? 1 : 0,
    x: prefersReducedMotion ? 0 : -Math.sign(direction || 1) * 26,
    scale: prefersReducedMotion ? 1 : 0.99,
    filter: prefersReducedMotion ? "none" : "blur(6px)",
  }),
};

function useViewportScale() {
  useEffect(() => {
    const updateScale = () => {
      const scale = Math.min(window.innerWidth / 393, window.innerHeight / 852);
      document.documentElement.style.setProperty("--app-scale", String(scale));
      document.documentElement.style.setProperty("--scaled-width", `${393 * scale}px`);
      document.documentElement.style.setProperty("--scaled-height", `${852 * scale}px`);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    window.addEventListener("orientationchange", updateScale);

    return () => {
      window.removeEventListener("resize", updateScale);
      window.removeEventListener("orientationchange", updateScale);
    };
  }, []);
}

createRoot(document.getElementById("root")).render(<App />);
