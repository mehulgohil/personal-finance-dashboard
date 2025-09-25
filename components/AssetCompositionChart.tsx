import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../constants';

interface AssetCompositionChartProps {
  data: { date: string, [key: string]: any }[];
  assetCategories: string[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, item: any) => sum + item.value, 0);
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-bold text-gray-900 dark:text-white mb-2">{`Date: ${label}`}</p>
          {payload.map((pld: any, index: number) => (
            <div key={index} style={{ color: pld.color }}>
              {`${pld.name}: ${pld.value.toLocaleString('en-IN')}`}
            </div>
          ))}
          <p className="font-semibold text-gray-800 dark:text-gray-200 mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
            {`Total Assets: ${total.toLocaleString('en-IN')}`}
          </p>
        </div>
      );
    }
    return null;
};

const AssetCompositionChart: React.FC<AssetCompositionChartProps> = ({ data, assetCategories }) => {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
          <XAxis dataKey="date" tick={{ fill: 'rgb(107 114 128)' }} />
          <YAxis 
            tickFormatter={(value) => new Intl.NumberFormat('en-IN', { notation: 'compact', compactDisplay: 'short' }).format(Number(value))}
            tick={{ fill: 'rgb(107 114 128)' }}
           />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {assetCategories.map((category, index) => (
            <Area
              key={category}
              type="monotone"
              dataKey={category}
              stackId="1"
              stroke={CHART_COLORS[index % CHART_COLORS.length]}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
              fillOpacity={0.8}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetCompositionChart;