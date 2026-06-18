import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Dock,
  FlowHeader,
  FlowProgress,
  PhoneShell
} from './components/Shell.jsx';
import { DetailRule, TransactionRow } from './components/Rows.jsx';
import './styles.css';

const routeOrder = { home: 0, addRegion: 1, detail: 2, stats: 3 };

const cardDeck = [
  {
    id: 'smart',
    bank: 'Standard Chartered',
    name: 'Smart Card',
    cardMetric: '本月 HKD 93.62',
    summaryValue: '本月累计：HKD 93.62',
    summaryText:
      'Smart Card 本月累计 HKD 93.62，日常餐饮和交通消费保持稳定回赠。',
    ruleValue: '稳定回赠',
    ruleText: '日常消费回赠持续累积 · 本月还有 HKD 1,200 可用额度',
    ruleProgress: 146,
    last4: '•••• 2468',
    rate: '5%',
    network: 'VISA',
    visualClass: 'smart-card',
    transactions: [
      ['Shake Shack', '餐饮 · 今天', 'HKD 96', '返现 4.80'],
      ['MTR', '交通 · 今天', 'HKD 18', '返现 0.90'],
      ['Pacific Coffee', '餐饮 · 昨天', 'HKD 42', '返现 2.10'],
      ['Wellcome', '超市 · 昨天', 'HKD 238', '返现 4.76'],
      ['CitySuper', '超市 · 周一', 'HKD 412', '返现 8.24']
    ]
  },
  {
    id: 'red',
    bank: 'HSBC',
    name: 'Red Card',
    cardMetric: '本月 HKD 158.20',
    summaryValue: '本月累计：HKD 158.20',
    summaryText: 'Red Card 本月累计 HKD 158.20，线上购物交易占比最高。',
    ruleValue: '线上优先',
    ruleText: '线上消费 4% 回赠 · 距离本月上限还有 HKD 860',
    ruleProgress: 184,
    last4: '•••• 1357',
    rate: '4%',
    network: 'VISA',
    visualClass: 'red-card',
    transactions: [
      ['HKTVmall', '网上消费 · 今天', 'HKD 1,280', '返现 51.20'],
      ['Apple Store', '网上消费 · 昨天', 'HKD 688', '返现 27.52'],
      ['Zara', '购物 · 昨天', 'HKD 429', '返现 17.16'],
      ['Netflix', '订阅 · 周二', 'HKD 93', '返现 3.72'],
      ['Taobao', '网上消费 · 周一', 'HKD 356', '返现 14.24']
    ]
  },
  {
    id: 'pulse',
    bank: 'HSBC',
    name: 'Pulse Card',
    cardMetric: '预计 HKD 486.32',
    summaryValue: '本月累计：HKD 486.32',
    summaryText: 'Pulse Card 本月累计 HKD 486.32，餐饮与线上消费贡献最高。',
    ruleValue: '额度接近',
    ruleText: '餐饮高返现额度仅剩 HKD 540 · 网上消费 5 天后重置',
    ruleProgress: 208,
    last4: '•••• 8821',
    rate: '7.4%',
    network: 'VISA',
    visualClass: 'pulse-card',
    detailPath: '/cards/pulse',
    transactions: [
      ['Starbucks', '餐饮 · 今天', 'HKD 68', '返现 5.03'],
      ['Deliveroo', '餐饮 · 今天', 'HKD 185', '返现 13.69'],
      ['HKTVmall', '网上消费 · 今天', 'HKD 1,280', '返现 51.20'],
      ['K11 Musea', '购物 · 昨天', 'HKD 760', '返现 28.12'],
      ['Uber', '交通 · 昨天', 'HKD 116', '返现 2.78'],
      ['Sushi Taka', '餐饮 · 周一', 'HKD 520', '返现 38.48']
    ]
  }
];

const transactions = cardDeck.find(card => card.id === 'pulse').transactions;

const stackSlots = [
  {
    left: 6,
    top: 104,
    width: 333,
    height: 210,
    borderRadius: 28,
    opacity: 1,
    zIndex: 3,
    scale: 1
  },
  {
    left: 31,
    top: 38,
    width: 300,
    height: 188,
    borderRadius: 24,
    opacity: 0.5,
    zIndex: 1,
    scale: 0.98
  },
  {
    left: 14,
    top: 72,
    width: 318,
    height: 200,
    borderRadius: 26,
    opacity: 0.72,
    zIndex: 2,
    scale: 0.99
  }
];

function getRoute(pathname) {
  if (pathname.startsWith('/cards/new/region')) return 'addRegion';
  if (pathname.startsWith('/cards/pulse')) return 'detail';
  if (pathname.startsWith('/stats')) return 'stats';
  return 'home';
}

function CardFace({ card }) {
  const pulse = card.id === 'pulse';

  return (
    <>
      {pulse ? (
        <>
          <div className="card-edge top" />
          <div className="card-edge bottom" />
          <div className="card-glow-left" />
          <div className="card-glow-right" />
          <div className="card-micro" />
        </>
      ) : (
        <div className="card-reflection" />
      )}
      <span className="bank-name">{card.bank}</span>
      <span className={`chip ${pulse ? '' : 'empty'}`}>
        {pulse ? <span /> : null}
      </span>
      <strong>{card.name}</strong>
      <em>{card.cardMetric}</em>
      <small>{card.last4}</small>
      <b>{card.rate}</b>
      {pulse ? (
        <>
          <span className="network-dot a" />
          <span className="network-dot b" />
        </>
      ) : null}
      <i>{card.network}</i>
    </>
  );
}

function CardPageContent({ navigate }) {
  const [activeCardIndex, setActiveCardIndex] = useState(2);
  const swipeRef = useRef({ startX: 0, startY: 0, didSwipe: false });
  const activeCard = cardDeck[activeCardIndex];

  const switchCard = direction => {
    setActiveCardIndex(
      current => (current + direction + cardDeck.length) % cardDeck.length
    );
  };

  const selectCard = index => {
    setActiveCardIndex(index);
  };

  const finishSwipe = () => {
    const { deltaX, deltaY } = swipeRef.current;
    const horizontalSwipe =
      Math.abs(deltaX) > 44 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2;

    if (!horizontalSwipe) return;

    swipeRef.current.didSwipe = true;
    switchCard(deltaX < 0 ? 1 : -1);
  };

  const handleStackPointerDown = event => {
    event.preventDefault();
    swipeRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      deltaX: 0,
      deltaY: 0,
      didSwipe: false
    };

    const updateSwipe = moveEvent => {
      swipeRef.current.deltaX = moveEvent.clientX - swipeRef.current.startX;
      swipeRef.current.deltaY = moveEvent.clientY - swipeRef.current.startY;
    };
    const endSwipe = endEvent => {
      updateSwipe(endEvent);
      window.removeEventListener('pointermove', updateSwipe);
      window.removeEventListener('pointerup', endSwipe);
      window.removeEventListener('pointercancel', endSwipe);
      finishSwipe();
    };

    window.addEventListener('pointermove', updateSwipe);
    window.addEventListener('pointerup', endSwipe);
    window.addEventListener('pointercancel', endSwipe);
  };

  const handleCardLinkClick = path => event => {
    if (swipeRef.current.didSwipe) {
      event.preventDefault();
      swipeRef.current.didSwipe = false;
      return;
    }

    navigate(path)(event);
  };

  return (
    <>
      <header className="cards-top-bar">
        <div className="cards-title-cluster">
          <h1>卡片</h1>
          <p>3 张卡 · 本月表现实时更新</p>
        </div>
        <a
          className="cards-add-button"
          href="/cards/new/region"
          aria-label="新增卡片"
          onClick={navigate('/cards/new/region')}
        >
          +
        </a>
      </header>

      <section
        className="cards-stack"
        aria-label="信用卡堆叠"
        onPointerDown={handleStackPointerDown}
      >
        {cardDeck.map((card, index) => {
          const slotIndex =
            (index - activeCardIndex + cardDeck.length) % cardDeck.length;
          const slot = stackSlots[slotIndex];
          const isFront = slotIndex === 0;
          const cardClassName = `bank-card stack-card ${card.visualClass}`;
          const cardProps = {
            className: cardClassName,
            animate: slot,
            initial: false,
            transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
            'aria-hidden': isFront ? 'false' : 'true'
          };

          return card.detailPath && isFront ? (
            <motion.a
              {...cardProps}
              className={`${cardClassName} detail-card-link`}
              href={card.detailPath}
              aria-label={`查看 ${card.name} 单卡详情`}
              key={card.id}
              draggable="false"
              onClick={handleCardLinkClick(card.detailPath)}
            >
              <CardFace card={card} />
            </motion.a>
          ) : (
            <motion.article {...cardProps} key={card.id}>
              <CardFace card={card} />
            </motion.article>
          );
        })}

        <div className="card-stack-indicators" aria-label="切换卡片">
          {cardDeck.map((card, index) => (
            <button
              className={index === activeCardIndex ? 'active' : ''}
              type="button"
              aria-label={`切换到 ${card.name}`}
              aria-pressed={index === activeCardIndex ? 'true' : 'false'}
              key={card.id}
              onClick={() => selectCard(index)}
            />
          ))}
        </div>
      </section>

      <motion.section
        className="cards-summary-panel"
        key={`${activeCard.id}-summary`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
      >
        <h2>当前聚焦卡片</h2>
        <strong>{activeCard.summaryValue}</strong>
        <p>{activeCard.summaryText}</p>
      </motion.section>

      <motion.section
        className="cards-rule-panel"
        key={`${activeCard.id}-rule`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
      >
        <div className="cards-rule-head">
          <b>提醒</b>
          <strong>{activeCard.ruleValue}</strong>
        </div>
        <p>{activeCard.ruleText}</p>
        <div className="cards-progress">
          <span style={{ width: `${activeCard.ruleProgress}px` }} />
        </div>
      </motion.section>

      <section className="cards-recent-panel">
        <h2>最近交易</h2>
        <motion.div
          className="transaction-list"
          role="list"
          aria-label={`${activeCard.name} 最近交易`}
          key={`${activeCard.id}-transactions`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
        >
          {activeCard.transactions.map((item, index) => (
            <TransactionRow key={`${item[0]}-${index}`} item={item} />
          ))}
        </motion.div>
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
        <p className="hero-milestone">
          年度 cashback 已突破
          <br />
          HKD 3,000
        </p>
        <p className="hero-comparison">比上月 +12.4% · 表现很漂亮</p>
        <div className="stat-pill annual-pill">
          <span>年度累计</span>
          <b>HKD 3,182</b>
        </div>
        <div className="stat-pill rate-pill">
          <span>平均返现率</span>
          <b>2.61%</b>
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
          <strong>HKD 318</strong>
        </div>
        <div className="track card-track">
          <span />
        </div>
        <div className="metric-row metric-category">
          <b>餐饮与线上消费</b>
          <strong>66%</strong>
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

const hotRegions = [
  { label: '中国香港', className: 'hong-kong' },
  { label: '新加坡', className: 'singapore' },
  { label: '日本', className: 'japan' }
];

const allRegions = [
  { label: '中国香港', selected: true },
  { label: '中国内地' },
  { label: '新加坡' },
  { label: '日本' },
  { label: '美国' }
];

const addCardSteps = [
  '选择地区',
  '选择银行',
  '选择卡产品',
  '确认卡片并设置账单信息',
  '新增成功'
];

const bankOptions = [
  { name: 'HSBC', count: '6 款信用卡产品', color: '#d81f2a' },
  { name: 'Standard Chartered', count: '4 款信用卡产品', color: '#1b7f54' },
  { name: 'Citi', count: '5 款信用卡产品', color: '#1b5fbf' },
  { name: 'DBS', count: '3 款信用卡产品', color: '#d23b3b' },
  { name: 'BOC Hong Kong', count: '4 款信用卡产品', color: '#b91c32' },
  { name: 'American Express', count: '2 款信用卡产品', color: '#2e6f9e' }
];

const productOptions = [
  {
    id: 'pulse',
    bank: 'HSBC',
    name: 'Pulse Card',
    meta: 'HKD / VISA',
    cashback: '7.4% 餐饮与线上 cashback',
    limit: '额度摘要：额外 5% 剩余 HKD 540',
    color: '#087b72',
    variant: 'featured'
  },
  {
    id: 'red',
    name: 'HSBC Red Card',
    meta: 'HKD / Mastercard',
    cashback: '4% dining cashback · 月额度 HKD 1,000',
    color: '#8e2f47'
  },
  {
    id: 'signature',
    name: 'Visa Signature',
    meta: 'HKD / VISA',
    cashback: '旅行与海外消费 3% · 月额度 HKD 3,000',
    color: '#11324d'
  }
];

const confirmFields = [
  { label: '卡号尾号', value: '8821' },
  { label: '备注', value: '日常餐饮' },
  { label: '账单日', value: '每月 18 日' },
  { label: '还款日', value: '每月 8 日' }
];

function AddCardFlowPage({ navigate }) {
  const [step, setStep] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState('中国香港');
  const [selectedBank, setSelectedBank] = useState('HSBC');
  const [selectedProduct, setSelectedProduct] = useState('pulse');
  const currentStep = addCardSteps[step];
  const progressWidth = (step + 1) * 69;
  const stepClass =
    step === 0
      ? 'region-step'
      : step === 1
      ? 'bank-step'
      : step === 2
      ? 'product-step'
      : step === 3
      ? 'confirm-step'
      : 'success-step';
  const isSuccessStep = step === 4;

  return (
    <PhoneShell className={`add-card-flow-page ${stepClass}`}>
      <FlowHeader
        title={isSuccessStep ? 'Cardce' : '新增卡'}
        subtitle={currentStep}
      />

      <button
        className="add-flow-close-button"
        type="button"
        aria-label="关闭并返回首页"
        onClick={navigate('/')}
      >
        ×
      </button>

      <FlowProgress step={step + 1} label={currentStep} width={progressWidth} />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          className="add-step-transition-layer"
          initial={{
            opacity: 0,
            x: step === 0 ? -18 : 18,
            filter: 'blur(6px)'
          }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: step === 0 ? 18 : -18, filter: 'blur(6px)' }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {step === 0 ? (
            <RegionStep
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
            />
          ) : null}
          {step === 1 ? (
            <BankStep
              selectedRegion={selectedRegion}
              selectedBank={selectedBank}
              onSelectBank={setSelectedBank}
            />
          ) : null}
          {step === 2 ? (
            <ProductStep
              selectedProduct={selectedProduct}
              onSelectProduct={setSelectedProduct}
            />
          ) : null}
          {step === 3 ? <ConfirmDetailsStep /> : null}
          {step === 4 ? <SuccessStep /> : null}
        </motion.div>
      </AnimatePresence>

      {step > 0 && !isSuccessStep ? (
        <button
          className="add-flow-bottom-button back"
          type="button"
          aria-label="返回上一步"
          onClick={() => setStep(step - 1)}
        >
          ←
        </button>
      ) : null}
      <button
        className={`add-flow-bottom-button ${isSuccessStep ? 'done' : 'next'}`}
        type="button"
        aria-label={isSuccessStep ? '确定并返回首页' : '下一步'}
        onClick={
          isSuccessStep ? navigate('/') : () => setStep(Math.min(step + 1, 4))
        }
      >
        {isSuccessStep ? '✓' : '→'}
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
          {hotRegions.map(region => (
            <button
              className={`hot-region-chip ${region.className} ${
                selectedRegion === region.label ? 'selected' : ''
              }`}
              key={region.label}
              type="button"
              aria-pressed={selectedRegion === region.label ? 'true' : 'false'}
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
          {allRegions.map(region => (
            <button
              className={`region-row ${
                selectedRegion === region.label ? 'selected' : ''
              }`}
              key={region.label}
              type="button"
              aria-pressed={selectedRegion === region.label ? 'true' : 'false'}
              onClick={() => onSelectRegion(region.label)}
            >
              <span>{region.label}</span>
              {selectedRegion === region.label ? (
                <b aria-hidden="true">✓</b>
              ) : null}
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
            className={`bank-row ${
              selectedBank === bank.name ? 'selected' : ''
            }`}
            key={bank.name}
            type="button"
            aria-pressed={selectedBank === bank.name ? 'true' : 'false'}
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
        {productOptions.map(product => {
          const selected = selectedProduct === product.id;
          return (
            <button
              className={`product-option ${
                product.variant === 'featured' ? 'featured' : 'compact'
              } ${selected ? 'selected' : ''}`}
              key={product.id}
              type="button"
              aria-pressed={selected ? 'true' : 'false'}
              onClick={() => onSelectProduct(product.id)}
            >
              <span
                className="product-thumbnail"
                style={{ background: product.color }}
              >
                {product.variant === 'featured' ? (
                  <>
                    <span className="product-thumbnail-chip" />
                    <span className="product-thumbnail-reflection" />
                  </>
                ) : null}
              </span>
              {product.bank ? (
                <span className="product-bank">{product.bank}</span>
              ) : null}
              <strong>{product.name}</strong>
              <em>{product.meta}</em>
              <span className="product-cashback">{product.cashback}</span>
              {product.limit ? (
                <span className="product-limit">{product.limit}</span>
              ) : null}
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
          {confirmFields.map(field => (
            <button className="confirm-field" type="button" key={field.label}>
              <span>{field.label}</span>
              <strong>{field.value}</strong>
            </button>
          ))}
        </div>
        <div className="confirm-rules-summary">
          <h3>默认 cashback 规则</h3>
          <p>
            基础 2.4% 无上限
            <br />
            餐饮/线上额外 5%，月额度 HKD 2,000
          </p>
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

function HomeStatsShell({ route, direction, prefersReducedMotion, navigate }) {
  const active = route === 'stats' ? 'stats' : 'home';

  return (
    <PhoneShell className={route === 'stats' ? 'stats-page' : 'cards-page'}>
      <AnimatePresence
        mode="wait"
        initial={false}
        custom={{ direction, prefersReducedMotion }}
      >
        <motion.div
          key={route}
          className="tab-content-transition-layer"
          custom={{ direction, prefersReducedMotion }}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: prefersReducedMotion ? 0 : 0.34,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          {route === 'stats' ? (
            <StatsPageContent />
          ) : (
            <CardPageContent navigate={navigate} />
          )}
        </motion.div>
      </AnimatePresence>
      <Dock active={active} navigate={navigate} />
    </PhoneShell>
  );
}

function App() {
  useViewportScale();
  useGlobalHaptics();

  return (
    <BrowserRouter>
      <RoutedApp />
    </BrowserRouter>
  );
}

function RoutedApp() {
  const prefersReducedMotion = useReducedMotion();
  const location = useLocation();
  const routerNavigate = useNavigate();
  const route = getRoute(location.pathname);
  const previousRouteRef = useRef(route);
  const direction = routeOrder[route] - routeOrder[previousRouteRef.current];

  useEffect(() => {
    previousRouteRef.current = route;
  }, [route]);

  const navigate = to => event => {
    if (event) {
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      )
        return;
      event.preventDefault();
    }

    if (location.pathname === to) return;
    routerNavigate(to);
  };

  if (route === 'home' || route === 'stats') {
    return (
      <Routes location={location}>
        <Route
          path="/"
          element={
            <HomeStatsShell
              route="home"
              direction={direction}
              prefersReducedMotion={prefersReducedMotion}
              navigate={navigate}
            />
          }
        />
        <Route
          path="/stats"
          element={
            <HomeStatsShell
              route="stats"
              direction={direction}
              prefersReducedMotion={prefersReducedMotion}
              navigate={navigate}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      custom={{ direction, prefersReducedMotion }}
    >
      <motion.div
        key={route}
        className="page-transition-layer"
        custom={{ direction, prefersReducedMotion }}
        variants={pageVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          duration: prefersReducedMotion ? 0 : 0.34,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        <Routes location={location}>
          <Route
            path="/cards/new/region"
            element={<AddCardFlowPage navigate={navigate} />}
          />
          <Route path="/cards/pulse" element={<CardDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

const pageVariants = {
  enter: ({ direction, prefersReducedMotion }) => ({
    opacity: prefersReducedMotion ? 1 : 0,
    x: prefersReducedMotion ? 0 : Math.sign(direction || 1) * 34,
    scale: prefersReducedMotion ? 1 : 0.985,
    filter: prefersReducedMotion ? 'none' : 'blur(8px)'
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px)'
  },
  exit: ({ direction, prefersReducedMotion }) => ({
    opacity: prefersReducedMotion ? 1 : 0,
    x: prefersReducedMotion ? 0 : -Math.sign(direction || 1) * 26,
    scale: prefersReducedMotion ? 1 : 0.99,
    filter: prefersReducedMotion ? 'none' : 'blur(6px)'
  })
};

function useGlobalHaptics() {
  useEffect(() => {
    const handleClick = event => {
      if (event.defaultPrevented || event.button !== 0) return;

      const target = event.target.closest?.('button, a, [role="button"]');
      if (!target) return;
      if (
        target.matches?.(
          'button:disabled, [disabled], [aria-disabled="true"]'
        )
      )
        return;

      navigator.vibrate?.(10);
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);
}

function useViewportScale() {
  useEffect(() => {
    const updateScale = () => {
      const widthRatio = window.innerWidth / 393;
      const heightRatio = window.innerHeight / 852;
      const mobileViewport =
        window.innerWidth <= 600 ||
        window.matchMedia('(hover: none), (pointer: coarse)').matches;
      const scale = mobileViewport
        ? Math.max(widthRatio, heightRatio)
        : Math.min(widthRatio, heightRatio);

      document.documentElement.classList.toggle(
        'mobile-cover',
        mobileViewport
      );
      document.documentElement.style.setProperty('--app-scale', String(scale));
      document.documentElement.style.setProperty(
        '--scaled-width',
        `${393 * scale}px`
      );
      document.documentElement.style.setProperty(
        '--scaled-height',
        `${852 * scale}px`
      );
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    window.addEventListener('orientationchange', updateScale);

    return () => {
      window.removeEventListener('resize', updateScale);
      window.removeEventListener('orientationchange', updateScale);
    };
  }, []);
}

createRoot(document.getElementById('root')).render(<App />);
