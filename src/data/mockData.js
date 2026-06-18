export const cardDeck = [
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

export const transactions = cardDeck.find(card => card.id === 'pulse').transactions;

export const stackSlots = [
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
export const hotRegions = [
  { label: '中国香港', className: 'hong-kong' },
  { label: '新加坡', className: 'singapore' },
  { label: '日本', className: 'japan' }
];

export const allRegions = [
  { label: '中国香港', selected: true },
  { label: '中国内地' },
  { label: '新加坡' },
  { label: '日本' },
  { label: '美国' }
];

export const addCardSteps = [
  '选择地区',
  '选择银行',
  '选择卡产品',
  '确认卡片并设置账单信息',
  '新增成功'
];

export const bankOptions = [
  { name: 'HSBC', count: '6 款信用卡产品', color: '#d81f2a' },
  { name: 'Standard Chartered', count: '4 款信用卡产品', color: '#1b7f54' },
  { name: 'Citi', count: '5 款信用卡产品', color: '#1b5fbf' },
  { name: 'DBS', count: '3 款信用卡产品', color: '#d23b3b' },
  { name: 'BOC Hong Kong', count: '4 款信用卡产品', color: '#b91c32' },
  { name: 'American Express', count: '2 款信用卡产品', color: '#2e6f9e' }
];

export const productOptions = [
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

export const confirmFields = [
  { label: '卡号尾号', value: '8821' },
  { label: '备注', value: '日常餐饮' },
  { label: '账单日', value: '每月 18 日' },
  { label: '还款日', value: '每月 8 日' }
];

