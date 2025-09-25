
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ProcessedMonthlyData } from '../types';

interface NetWorthChartProps {
  data: ProcessedMonthlyData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-bold text-gray-900 dark:text-white">{`Date: ${label}`}</p>
          <p className="text-blue-500">{`Net: ${data.net.toLocaleString('en-IN')}`}</p>
          <p className="text-green-500">{`Assets: ${data.totalAsset.toLocaleString('en-IN')}`}</p>
          <p className="text-red-500">{`Liabilities: ${data.totalLiability.toLocaleString('en-IN')}`}</p>
        </div>
      );
    }
  
    return null;
};

const NetWorthChart: React.FC<NetWorthChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
            <BarChart
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
            <XAxis dataKey="date" tick={{ fill: 'rgb(107 114 128)' }} />
            <YAxis tickFormatter={(value) => new Intl.NumberFormat('en-IN', { notation: 'compact', compactDisplay: 'short' }).format(Number(value))} tick={{ fill: 'rgb(107 114 128)' }} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(200, 200, 200, 0.1)'}}/>
            <Legend />
            <Bar dataKey="net" fill="#3b82f6" name="Net Worth" />
            <Bar dataKey="totalAsset" fill="#22c55e" name="Total Assets" />
            <Bar dataKey="totalLiability" fill="#ef4444" name="Total Liabilities" />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default NetWorthChart;
