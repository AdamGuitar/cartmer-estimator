export type EstimateInput = {
  itemType: string;
  metal: string;
  goldPricePerGram: number;
  metalPurityFactor: number;
  weightGrams: number;
  stoneCost: number;
  labourCost: number;
  settingCost: number;
  rhodiumCost: number;
  miscCost: number;
  markup: number;
  fingerSize: string;
  notes: string;
};

export type EstimateOutput = {
  metalCost: number;
  totalCost: number;
  sellPrice: number;
  grossProfit: number;
  marginPercent: number;
};

export function calcEstimate(input: EstimateInput): EstimateOutput {
  const metalCost = input.goldPricePerGram * input.metalPurityFactor * input.weightGrams;
  const totalCost = metalCost + input.stoneCost + input.labourCost + input.settingCost + input.rhodiumCost + input.miscCost;
  const sellPrice = totalCost * input.markup;
  const grossProfit = sellPrice - totalCost;
  const marginPercent = sellPrice > 0 ? (grossProfit / sellPrice) * 100 : 0;

  return {
    metalCost,
    totalCost,
    sellPrice,
    grossProfit,
    marginPercent
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 2
  }).format(value);
}

export const METALS = [
  { label: '9ct Gold', value: '9ct', purity: 0.375 },
  { label: '14ct Gold', value: '14ct', purity: 0.585 },
  { label: '18ct Gold', value: '18ct', purity: 0.75 },
  { label: 'Platinum', value: 'platinum', purity: 0.95 },
  { label: 'Sterling Silver', value: 'sterling', purity: 0.925 }
];
