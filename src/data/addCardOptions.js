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
    bank: 'HSBC',
    name: 'HSBC Red Card',
    meta: 'HKD / Mastercard',
    cashback: '4% dining cashback · 月额度 HKD 1,000',
    color: '#8e2f47'
  },
  {
    id: 'signature',
    bank: 'HSBC',
    name: 'Visa Signature',
    meta: 'HKD / VISA',
    cashback: '旅行与海外消费 3% · 月额度 HKD 3,000',
    color: '#11324d'
  }
];
