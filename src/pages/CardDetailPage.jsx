import React from 'react';
import { createPortal } from 'react-dom';
import { AnimatedValue } from '../components/AnimatedValue.jsx';
import { PhoneShell } from '../components/Shell.jsx';
import { DetailRule, TransactionRow } from '../components/Rows.jsx';

export function CardDetailPage({ navigate, cards = [] }) {
  const card = cards.find(item => item.id === 'pulse') || cards[0];
  const metrics = [
    ['本月消费', card ? '18.6k' : '0'],
    ['平均返现', card?.rate || '0%'],
    ['年度累计', card ? '3,182' : '0'],
    ['单卡统计', card ? '查看' : '暂无']
  ];

  return (
    <>
      <PhoneShell className="detail-page">
        <header className="detail-top-bar">
          <div className="detail-title-cluster">
            <h1>{card?.name || '卡片详情'}</h1>
            <p>{card ? '单卡详情' : '暂无本地卡片数据'}</p>
          </div>
        </header>

        <section className="detail-hero-card" aria-label={card?.name || '暂无卡片'}>
          <div className="detail-reflection" />
          <div className="detail-ambient" />
          <div className="detail-micro" />
          <div className="detail-edge" />
          <span className="detail-bank">{card?.bank || 'Cardce'}</span>
          <span className="detail-chip">
            <span className="detail-chip-inset" />
            <span className="detail-chip-v" />
            <span className="detail-chip-h" />
          </span>
          <strong className="detail-card-name">{card?.name || '暂无卡片'}</strong>
          <em className="detail-cashback">
            <AnimatedValue value={card?.cardMetric || 'HKD 0'} />
          </em>
          <small className="detail-last4">{card?.last4 || '•••• ----'}</small>
          <b className="detail-rate">
            <AnimatedValue value={card?.rate || '0%'} />
          </b>
          <i className="detail-network">{card?.network || 'VISA'}</i>
          <span className="detail-network-dot dot-a" />
          <span className="detail-network-dot dot-b" />
        </section>

        <section className="detail-metric-strip" aria-label="核心指标">
          {metrics.map(([label, value]) => (
            <div className="detail-metric" key={label}>
              <span>
                {label}
                <br />
                <AnimatedValue value={value} />
              </span>
            </div>
          ))}
        </section>

        <DetailRule
          className="cashback-rule"
          title="本月预计 cashback"
          value={card ? 'HKD 486' : 'HKD 0'}
          meta={card?.summaryText || '新增卡片后会生成本月预计返现。'}
        />
        <DetailRule
          className="quota-rule"
          title="返现额度 · 返现规则"
          value={card ? '剩 540' : '暂无'}
          meta={card?.ruleText || '暂无返现规则数据。'}
        />

        <section className="detail-transactions">
          <h2>全部交易</h2>
          {(card?.transactions || []).map(item => (
            <TransactionRow key={item[0]} item={item} />
          ))}
          {!card ? <p className="detail-empty-copy">暂无交易数据</p> : null}
        </section>
      </PhoneShell>

      {createPortal(
        <div className="detail-fixed-layer">
          <button
            className="add-flow-bottom-button detail-back-button back"
            type="button"
            aria-label="返回首页"
            onClick={navigate('/')}
          >
            ←
          </button>
        </div>,
        document.body
      )}
    </>
  );
}
