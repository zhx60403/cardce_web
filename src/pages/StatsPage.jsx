import React from 'react';
import { AnimatedValue } from '../components/AnimatedValue.jsx';

export function StatsPage({ cards = [] }) {
  if (cards.length === 0) {
    return (
      <>
        <header className="stats-top-bar">
          <div className="stats-title-cluster">
            <h1>统计分析</h1>
            <p>添加卡片后，这里会生成数据统计</p>
          </div>
        </header>

        <section className="stats-empty-state">
          <h2>没有卡片数据</h2>
          <p>当前本地缓存里还没有卡片。新增卡片后，返现、额度和交易统计会在这里展示。</p>
        </section>
      </>
    );
  }

  const primaryCard = cards[cards.length - 1];
  const cardAmount = primaryCard.cardMetric?.replace(/^本月\s*/, '') || 'HKD 0';
  const contribution = cardAmount.replace(/\.\d+$/, '');

  return (
    <>
      <header className="stats-top-bar">
        <div className="stats-title-cluster">
          <h1>统计分析</h1>
          <p>{cards.length} 张卡 · 本地缓存数据实时统计</p>
        </div>
      </header>

      <section className="stats-hero" aria-label="本月返现摘要">
        <span className="stats-aura stats-aura-liquid" />
        <span className="stats-aura stats-aura-achievement" />
        <p className="hero-label">本月总 cashback</p>
        <strong className="hero-amount">
          <AnimatedValue value={cardAmount} />
        </strong>
        <p className="hero-milestone">
          本地卡包已保存
          <br />
          <AnimatedValue value={`${cards.length} 张卡`} />
        </p>
        <p className="hero-comparison">
          平均返现率 <AnimatedValue value={primaryCard.rate} /> · 数据来自本地缓存
        </p>
        <div className="stat-pill annual-pill">
          <span>本地累计</span>
          <b>
            <AnimatedValue value={contribution} />
          </b>
        </div>
        <div className="stat-pill rate-pill">
          <span>平均返现率</span>
          <b>
            <AnimatedValue value={primaryCard.rate} />
          </b>
        </div>
        <div className="emoji-glow" />
        <div className="emoji-face">
          <span className="emoji-eye eye-left" />
          <span className="emoji-eye eye-right" />
          <span className="emoji-mouth">⌁</span>
        </div>
        <span className="spark sparkle-one" />
        <span className="spark sparkle-two" />
        <span className="spark sparkle-three" />
        <div className="hero-popover">
          <b>{primaryCard.name} 是当前本地卡包的最新卡片。</b>
          <span>{primaryCard.ruleText}</span>
        </div>
      </section>

      <section className="stats-panel contribution-panel" aria-label="贡献来源">
        <h2>贡献来源</h2>
        <div className="metric-row metric-card">
          <b>{primaryCard.name}</b>
          <strong>
            <AnimatedValue value={contribution} />
          </strong>
        </div>
        <div className="track card-track">
          <span />
        </div>
        <div className="metric-row metric-category">
          <b>{primaryCard.note || '默认规则'}</b>
          <strong>
            <AnimatedValue value={primaryCard.rate} />
          </strong>
        </div>
        <div className="track category-track">
          <span />
        </div>
      </section>

      <section className="stats-panel trend-panel" aria-label="月度趋势">
        <h2>月度趋势</h2>
        <p>新增或修改卡片信息后，统计会同步读取本地缓存。</p>
        <strong className="milestone-badge">本地</strong>
        <span className="milestone-dot" />
        <span className="bar apr" />
        <span className="bar may" />
        <span className="bar jun" />
      </section>

      <section className="stats-panel advice-panel" aria-label="行动建议">
        <h2>行动建议</h2>
        <p>继续完善卡片账单日、还款日和备注，可让本地统计更准确。</p>
      </section>
    </>
  );
}
