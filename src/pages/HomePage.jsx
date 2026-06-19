import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedValue } from '../components/AnimatedValue.jsx';
import { TransactionRow } from '../components/Rows.jsx';
import { stackSlots } from '../data/mockData.js';

function CardFace({ card }) {
  const pulse = card.visualClass === 'pulse-card';

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
      <em>
        <AnimatedValue value={card.cardMetric} />
      </em>
      <small>{card.last4}</small>
      <b>
        <AnimatedValue value={card.rate} />
      </b>
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

function getCardIndexById(cards, cardId) {
  if (!cardId) return Math.max(cards.length - 1, 0);

  const index = cards.findIndex(card => card.id === cardId);
  return index >= 0 ? index : Math.max(cards.length - 1, 0);
}

export function HomePage({
  navigate,
  getHref = path => path,
  cards = [],
  focusCardId
}) {
  const [activeCardIndex, setActiveCardIndex] = useState(() =>
    getCardIndexById(cards, focusCardId)
  );
  const swipeRef = useRef({ startX: 0, startY: 0, didSwipe: false });
  const activeCard = cards[activeCardIndex] || cards[0];

  useEffect(() => {
    if (!focusCardId) return;
    setActiveCardIndex(getCardIndexById(cards, focusCardId));
  }, [cards, focusCardId]);

  useEffect(() => {
    if (cards.length === 0) return;
    setActiveCardIndex(current => Math.min(current, cards.length - 1));
  }, [cards.length]);

  const switchCard = direction => {
    if (cards.length < 2) return;
    setActiveCardIndex(
      current => (current + direction + cards.length) % cards.length
    );
  };

  const selectCard = index => {
    setActiveCardIndex(index);
  };

  const finishSwipe = () => {
    if (cards.length < 2) return;

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
          <p>
            {cards.length > 0
              ? `${cards.length} 张卡 · 本月表现实时更新`
              : '还没有卡片 · 添加后开始统计'}
          </p>
        </div>
      </header>

      {cards.length === 0 ? (
        <section className="cards-empty-state">
          <h2>还没有卡片数据</h2>
          <p>添加第一张卡片后，这里会展示卡片堆叠、累计返现和最近交易。</p>
          <a href={getHref('/cards/new/region')} onClick={navigate('/cards/new/region')}>
            添加卡片
          </a>
        </section>
      ) : null}

      {cards.length > 0 ? (
        <section
          className="cards-stack"
          aria-label="信用卡卡堆"
          onPointerDown={handleStackPointerDown}
        >
          {cards.map((card, index) => {
            const slotIndex =
              (index - activeCardIndex + cards.length) % cards.length;
            const slot = stackSlots[slotIndex % stackSlots.length];
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
                href={getHref(card.detailPath)}
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
            {cards.map((card, index) => (
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
      ) : null}

      {activeCard ? (
        <div className="cards-scroll-content">
          <div className="cards-scroll-inner">
            <motion.section
              className="cards-summary-panel"
              key={`${activeCard.id}-summary`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
            >
              <h2>当前聚焦卡片</h2>
              <strong>
                <AnimatedValue value={activeCard.summaryValue} />
              </strong>
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
          </div>
        </div>
      ) : null}
    </>
  );
}
