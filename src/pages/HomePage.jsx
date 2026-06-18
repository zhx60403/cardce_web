import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TransactionRow } from '../components/Rows.jsx';
import { cardDeck, stackSlots } from '../data/mockData.js';

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

export function HomePage({ navigate }) {
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
        </div>
      </div>
    </>
  );
}
