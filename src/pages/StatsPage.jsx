import React from 'react';
import { AnimatedValue } from '../components/AnimatedValue.jsx';

export function StatsPage() {
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
        <strong className="hero-amount">
          <AnimatedValue value="HKD 486" />
        </strong>
        <p className="hero-milestone">
          年度 cashback 已突破
          <br />
          <AnimatedValue value="HKD 3,000" />
        </p>
        <p className="hero-comparison">
          比上月 <AnimatedValue value="+12.4%" /> · 表现很漂亮
        </p>
        <div className="stat-pill annual-pill">
          <span>年度累计</span>
          <b>
            <AnimatedValue value="HKD 3,182" />
          </b>
        </div>
        <div className="stat-pill rate-pill">
          <span>平均返现率</span>
          <b>
            <AnimatedValue value="2.61%" />
          </b>
        </div>
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
        <div className="metric-row metric-card">
          <b>Pulse Card</b>
          <strong>
            <AnimatedValue value="HKD 318" />
          </strong>
        </div>
        <div className="track card-track">
          <span />
        </div>
        <div className="metric-row metric-category">
          <b>餐饮与线上消费</b>
          <strong>
            <AnimatedValue value="66%" />
          </strong>
        </div>
        <div className="track category-track">
          <span />
        </div>
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
