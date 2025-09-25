import React from 'react';
import type { ProcessedMonthlyData } from '../types';

interface SummaryCardsProps {
  data: ProcessedMonthlyData[];
}

const SummaryCard: React.FC<{ title: string; value: string; change: string; changeType: 'increase' | 'decrease' | 'neutral' }> = ({ title, value, change, changeType }) => {
  const changeColor = changeType === 'increase' ? 'text-green-500' : changeType === 'decrease' ? 'text-red-500' : 'text-gray-500 dark:text-gray-400';
  const changeIcon = changeType === 'increase' ? '▲' : changeType === 'decrease' ? '▼' : '';

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg transition-transform hover:scale-105">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
      <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className={`mt-2 text-sm font-semibold ${changeColor}`}>
        {changeIcon} {change}
      </p>
    </div>
  );
};

const SummaryCards: React.FC<SummaryCardsProps> = ({ data }) => {
  if (data.length === 0) return null;

  const latest = data[data.length - 1];
  const previous = data.length > 1 ? data[data.length - 2] : null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // FIX: Added an explicit return type to ensure TypeScript correctly infers the `type` property.
  const getChange = (current: number, prev: number | null): { percentage: string; type: 'increase' | 'decrease' | 'neutral' } => {
    if (prev === null || prev === 0) return { percentage: '0.00%', type: 'neutral' };
    const change = ((current - prev) / Math.abs(prev)) * 100;
    return {
      percentage: `${change.toFixed(2)}%`,
      type: change > 0 ? 'increase' : (change < 0 ? 'decrease' : 'neutral'),
    };
  };

  const netWorthChange = getChange(latest.net, previous?.net ?? null);
  const assetsChange = getChange(latest.totalAsset, previous?.totalAsset ?? null);
  const liabilitiesChange = getChange(latest.totalLiability, previous?.totalLiability ?? null);


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SummaryCard
        title="Net Worth"
        value={formatCurrency(latest.net)}
        change={`${netWorthChange.percentage} from last month`}
        changeType={netWorthChange.type}
      />
      <SummaryCard
        title="Total Assets"
        value={formatCurrency(latest.totalAsset)}
        change={`${assetsChange.percentage} from last month`}
        changeType={assetsChange.type}
      />
      <SummaryCard
        title="Total Liabilities"
        value={formatCurrency(latest.totalLiability)}
        change={`${liabilitiesChange.percentage} from last month`}
        changeType={liabilitiesChange.type === 'increase' ? 'decrease' : liabilitiesChange.type === 'decrease' ? 'increase' : 'neutral'} // Inverted for liabilities
      />
    </div>
  );
};

export default SummaryCards;