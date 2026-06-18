import React from 'react';
import { PhoneShell } from '../components/Shell.jsx';
import { DetailRule, TransactionRow } from '../components/Rows.jsx';
import { transactions } from '../data/mockData.js';

export function CardDetailPage() {
  const metrics = [
    ['本月消费', '18.6k'],
    ['平均返现', '2.61%'],
    ['年度累计', '3,182'],
    ['单卡统计', '查看']
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
            <span>
              {label}
              <br />
              {value}
            </span>
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
        {transactions.map(item => (
          <TransactionRow key={item[0]} item={item} />
        ))}
      </section>
    </PhoneShell>
  );
}

