import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AnimatedValue } from '../components/AnimatedValue.jsx';
import { FlowHeader, FlowProgress, PhoneShell } from '../components/Shell.jsx';
import {
  addCardSteps,
  allRegions,
  bankOptions,
  productOptions
} from '../data/addCardOptions.js';
import {
  clearAddCardDraft,
  createCardFromForm,
  readAddCardDraft,
  writeAddCardDraft
} from '../data/cardStorage.js';

const dayOptions = Array.from({ length: 31 }, (_, index) => index + 1);

export function AddCardFlowPage({ navigate, onSaveCard }) {
  const draft = readAddCardDraft();
  const [step, setStep] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState(
    draft?.selectedRegion || '中国香港'
  );
  const [selectedBank, setSelectedBank] = useState(
    draft?.selectedBank || 'HSBC'
  );
  const [selectedProduct, setSelectedProduct] = useState(
    draft?.selectedProduct || 'pulse'
  );
  const [cardInfo, setCardInfo] = useState({
    last4: draft?.cardInfo?.last4 || '8821',
    note: draft?.cardInfo?.note || '日常餐饮',
    billDay: draft?.cardInfo?.billDay || '18',
    paymentDay: draft?.cardInfo?.paymentDay || '8'
  });
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

  useEffect(() => {
    writeAddCardDraft({
      selectedRegion,
      selectedBank,
      selectedProduct,
      cardInfo
    });
  }, [cardInfo, selectedBank, selectedProduct, selectedRegion]);

  const updateCardInfo = (field, value) => {
    setCardInfo(current => ({
      ...current,
      [field]:
        field === 'last4' ? value.replace(/\D/g, '').slice(0, 4) : value
    }));
  };

  const saveCurrentCard = () => {
    const nextCard = createCardFromForm({
      selectedBank,
      selectedProduct,
      selectedRegion,
      cardInfo
    });
    onSaveCard?.(nextCard);
    clearAddCardDraft();
    return nextCard;
  };

  const goNext = () => {
    if (step === 3) {
      saveCurrentCard();
      setStep(4);
      return;
    }

    if (step === 4) {
      navigate(`/?focus=${selectedProduct}`)();
      return;
    }

    setStep(Math.min(step + 1, 4));
  };

  const fixedButtons = (
    <div className="add-flow-fixed-layer">
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
        onClick={goNext}
      >
        {isSuccessStep ? '✓' : '→'}
      </button>
    </div>
  );

  return (
    <>
      <PhoneShell className={`add-card-flow-page ${stepClass}`}>
        <FlowHeader title={isSuccessStep ? 'Cardce' : '新增卡片'} subtitle={currentStep} />

        {!isSuccessStep ? (
          <button
            className="add-flow-close-button"
            type="button"
            aria-label="关闭并返回首页"
            onClick={navigate('/')}
          >
            ×
          </button>
        ) : null}

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
            {step === 3 ? (
              <ConfirmDetailsStep
                cardInfo={cardInfo}
                onChangeCardInfo={updateCardInfo}
              />
            ) : null}
            {step === 4 ? <SuccessStep /> : null}
          </motion.div>
        </AnimatePresence>
      </PhoneShell>

      {createPortal(fixedButtons, document.body)}
    </>
  );
}

function RegionStep({ selectedRegion, onSelectRegion }) {
  return (
    <>
      {/*
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
      */}

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
      {/*
      <div className="bank-search-field" role="search">
        <span>搜索银行</span>
      </div>
      */}
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

function ConfirmDetailsStep({ cardInfo, onChangeCardInfo }) {
  return (
    <>
      <section className="confirm-card-face" aria-label="Pulse Card">
        <span className="confirm-card-reflection" />
        <span className="confirm-card-chip" />
        <span className="confirm-card-bank">HSBC</span>
        <strong className="confirm-card-name">Pulse Card</strong>
        <span className="confirm-card-cashback">
          <AnimatedValue value="本月 HKD 234.50" />
        </span>
        <span className="confirm-card-last4">
          •••• {cardInfo.last4 || '----'}
        </span>
        <b className="confirm-card-rate">
          <AnimatedValue value="7.4%" />
        </b>
        <i className="confirm-card-network">VISA</i>
      </section>

      <section className="confirm-details-surface" aria-label="卡片详细信息">
        <h2>卡片信息</h2>
        <div className="confirm-field-grid">
          <label className="confirm-field">
            <span>卡号尾号</span>
            <input
              inputMode="numeric"
              maxLength={4}
              value={cardInfo.last4}
              onChange={event => onChangeCardInfo('last4', event.target.value)}
            />
          </label>
          <label className="confirm-field">
            <span>备注</span>
            <input
              value={cardInfo.note}
              onChange={event => onChangeCardInfo('note', event.target.value)}
            />
          </label>
          <label className="confirm-field">
            <span>账单日</span>
            <select
              value={cardInfo.billDay}
              onChange={event => onChangeCardInfo('billDay', event.target.value)}
            >
              {dayOptions.map(day => (
                <option key={day} value={day}>
                  每月 {day} 日
                </option>
              ))}
            </select>
          </label>
          <label className="confirm-field">
            <span>还款日</span>
            <select
              value={cardInfo.paymentDay}
              onChange={event =>
                onChangeCardInfo('paymentDay', event.target.value)
              }
            >
              {dayOptions.map(day => (
                <option key={day} value={day}>
                  每月 {day} 日
                </option>
              ))}
            </select>
          </label>
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
      <p className="success-wallet-hint">新卡循环加入卡堆，完成后聚焦新卡</p>
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
      <p className="success-auto-return-hint">点击确定返回首页 · 自动聚焦新卡</p>
    </section>
  );
}
