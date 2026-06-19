import { productOptions } from './addCardOptions.js';

export const CARD_STORAGE_KEY = 'cardce:cards';
export const ADD_CARD_DRAFT_KEY = 'cardce:add-card-draft';

const fallbackTransactions = [
  ['Starbucks', '餐饮 · 今天', 'HKD 68', '返现 5.03'],
  ['Deliveroo', '餐饮 · 今天', 'HKD 185', '返现 13.69'],
  ['HKTVmall', '线上消费 · 今天', 'HKD 1,280', '返现 51.20'],
  ['K11 Musea', '购物 · 昨天', 'HKD 760', '返现 28.12'],
  ['Uber', '交通 · 昨天', 'HKD 116', '返现 2.78'],
  ['Sushi Taka', '餐饮 · 周一', 'HKD 520', '返现 38.48']
];

export function readStoredCards() {
  if (typeof window === 'undefined') return [];

  try {
    const rawCards = window.localStorage.getItem(CARD_STORAGE_KEY);
    const cards = rawCards ? JSON.parse(rawCards) : [];
    return Array.isArray(cards) ? cards : [];
  } catch {
    return [];
  }
}

export function writeStoredCards(cards) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CARD_STORAGE_KEY, JSON.stringify(cards));
}

export function readAddCardDraft() {
  if (typeof window === 'undefined') return null;

  try {
    const rawDraft = window.localStorage.getItem(ADD_CARD_DRAFT_KEY);
    return rawDraft ? JSON.parse(rawDraft) : null;
  } catch {
    return null;
  }
}

export function writeAddCardDraft(draft) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ADD_CARD_DRAFT_KEY, JSON.stringify(draft));
}

export function clearAddCardDraft() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ADD_CARD_DRAFT_KEY);
}

export function upsertStoredCard(cards, nextCard) {
  const index = cards.findIndex(card => card.id === nextCard.id);

  if (index === -1) {
    return [...cards, nextCard];
  }

  return cards.map(card => (card.id === nextCard.id ? nextCard : card));
}

export function createCardFromForm({
  selectedBank,
  selectedProduct,
  selectedRegion,
  cardInfo
}) {
  const product =
    productOptions.find(option => option.id === selectedProduct) ||
    productOptions[0];
  const rate = product.cashback?.match(/\d+(?:\.\d+)?%/)?.[0] || '2.4%';
  const cardName = product.name || 'New Card';
  const amount = selectedProduct === 'pulse' ? '486.32' : '234.50';

  return {
    id: selectedProduct,
    bank: product.bank || selectedBank,
    name: cardName,
    cardMetric: `本月 HKD ${amount}`,
    summaryValue: `本月累计：HKD ${amount}`,
    summaryText: `${cardName} 已加入卡包，账单日每月 ${cardInfo.billDay} 日，还款日每月 ${cardInfo.paymentDay} 日。`,
    ruleValue: '已启用',
    ruleText: `${product.cashback || '默认 cashback 规则'} · ${cardInfo.note || selectedRegion}`,
    ruleProgress: selectedProduct === 'pulse' ? 208 : 168,
    last4: `•••• ${cardInfo.last4 || '0000'}`,
    rate,
    network: product.meta?.includes('Mastercard') ? 'MC' : 'VISA',
    visualClass:
      selectedProduct === 'red'
        ? 'red-card'
        : selectedProduct === 'signature'
        ? 'smart-card'
        : 'pulse-card',
    detailPath: selectedProduct === 'pulse' ? '/cards/pulse' : undefined,
    region: selectedRegion,
    billDay: cardInfo.billDay,
    paymentDay: cardInfo.paymentDay,
    note: cardInfo.note,
    transactions: fallbackTransactions
  };
}
