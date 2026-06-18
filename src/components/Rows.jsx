import React from "react";
import { AnimatedValue } from './AnimatedValue.jsx';

export function TransactionRow({ item }) {
  return (
    <div className="transaction-row">
      <div className="merchant-icon" />
      <div className="transaction-text">
        <b>{item[0]}</b>
        <span>{item[1]}</span>
      </div>
      <div className="transaction-amount">
        <b>
          <AnimatedValue value={item[2]} />
        </b>
        <span>
          <AnimatedValue value={item[3]} />
        </span>
      </div>
    </div>
  );
}

export function DetailRule({ className, title, value, meta }) {
  return (
    <section className={`detail-rule-card ${className}`}>
      <div className="detail-rule-head">
        <b>{title}</b>
        <strong>
          <AnimatedValue value={value} />
        </strong>
      </div>
      <p>{meta}</p>
      <div className="detail-progress"><span /></div>
    </section>
  );
}
