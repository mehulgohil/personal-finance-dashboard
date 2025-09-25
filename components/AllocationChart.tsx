import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../constants';

interface AllocationChartData {
  name: string;
  value: number;
}

interface AllocationChartProps {
  data: AllocationChartData[];
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, percent } = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-bold text-gray-900 dark:text-white">{name}</p>
          <p className="text-gray-700 dark:text-gray-300">
            {`Value: ${value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}`}
          </p>
          <p className="text-gray-600 dark:text-gray-400">{`Percentage: ${(percent * 100).toFixed(2)}%`}</p>
        </div>
      );
    }
  
    return null;
};

const AllocationChart: React.FC<AllocationChartProps> = ({ data }) => {
    if (data.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400" style={{ height: 300 }}>No data to display</div>;
    }
  return (
    <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                >
                    {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={10} wrapperStyle={{fontSize: '14px'}} />
            </PieChart>
        </ResponsiveContainer>
    </div>
  );
};

export default AllocationChart;