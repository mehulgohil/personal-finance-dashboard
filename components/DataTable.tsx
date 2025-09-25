import React, { useState } from 'react';
import type { ProcessedMonthlyData } from '../types';

interface DataTableProps {
  data: ProcessedMonthlyData[];
  assetCategories: string[];
  liabilityCategories: string[];
  onDataChange: (rowIndex: number, type: 'assets' | 'liabilities', category: string, value: string) => void;
  onAddMonth: () => void;
  onAddCategory: (type: 'assets' | 'liabilities', category: string) => void;
  onRemoveCategory: (type: 'assets' | 'liabilities', category: string) => void;
}

const formatNumber = (num: number) => Math.round(num).toLocaleString('en-IN');
const formatPercentage = (num: number) => num.toFixed(2) + '%';

const DataInput: React.FC<{value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({ value, onChange }) => (
    <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full bg-transparent p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-right"
    />
);

const AddCategoryRow: React.FC<{ type: 'assets' | 'liabilities', onAddCategory: (type: 'assets' | 'liabilities', category: string) => void, colSpan: number }> = ({ type, onAddCategory, colSpan }) => {
  const [categoryName, setCategoryName] = useState('');

  const handleAdd = () => {
    if (categoryName.trim()) {
      onAddCategory(type, categoryName.trim());
      setCategoryName('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <tr className="bg-gray-50 dark:bg-gray-800/50">
      <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`New ${type === 'assets' ? 'Asset' : 'Liability'} Name`}
            className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleAdd}
            className="px-3 py-2 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition"
            aria-label={`Add new ${type} category`}
          >
            ADD
          </button>
        </div>
      </td>
      <td colSpan={colSpan - 1} className="px-4 py-2 border-b border-gray-200 dark:border-gray-700"></td>
    </tr>
  );
};

const DataTable: React.FC<DataTableProps> = ({ data, assetCategories, liabilityCategories, onDataChange, onAddMonth, onAddCategory, onRemoveCategory }) => {
  const headers = ['Details', ...data.map(d => d.date)];

  const summaryRows = [
    { label: 'Total Asset', key: 'totalAsset', isTotal: true, style: 'bg-green-100 dark:bg-green-900/30 font-bold' },
    { label: 'Diff in Total Asset', key: 'diffInTotalAsset', isDiff: true, style: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { label: 'My Assets', key: 'myAssets', style: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { label: 'Total Liability', key: 'totalLiability', isTotal: true, style: 'bg-red-100 dark:bg-red-900/30 font-bold' },
    { label: 'Net', key: 'net', isTotal: true, style: 'bg-green-200 dark:bg-green-800/40 font-bold text-lg' },
    { label: 'Percentage Change', key: 'percentageChange', isPercentage: true, style: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Diff in Net', key: 'diffInNet', isDiff: true, style: 'bg-green-50 dark:bg-green-900/20' },
  ];

  const renderDataRow = (category: string, type: 'assets' | 'liabilities') => (
    <tr key={`${type}-${category}`} className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span>{category}</span>
          <button 
            onClick={() => onRemoveCategory(type, category)} 
            className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
            aria-label={`Remove ${category} category`}
          >
            &#x2715;
          </button>
        </div>
      </td>
      {data.map((monthData, colIndex) => (
        <td key={colIndex} className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
          <DataInput 
            value={(monthData[type] && monthData[type][category]) || 0}
            onChange={(e) => onDataChange(colIndex, type, category, e.target.value)}
          />
        </td>
      ))}
    </tr>
  );

  const renderSummaryRow = (row: (typeof summaryRows)[number] | undefined) => {
    if (!row) return null;
    return (
        <tr key={row.key} className={row.style}>
            <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">{row.label}</td>
            {data.map((monthData, colIndex) => (
                <td key={colIndex} className={`px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 text-right`}>
                    <span className={`${row.isDiff && (monthData as any)[row.key] < 0 ? 'text-red-500' : ''} ${row.isDiff && (monthData as any)[row.key] > 0 ? 'text-green-500' : ''}`}>
                        {row.isPercentage ? formatPercentage((monthData as any)[row.key]) : formatNumber((monthData as any)[row.key])}
                    </span>
                </td>
            ))}
        </tr>
    )
  };

  const renderSectionHeader = (label: string) => (
    <tr className="bg-gray-100 dark:bg-gray-700/50">
        <td colSpan={headers.length} className="px-4 py-2 text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wider border-y border-gray-200 dark:border-gray-700">
            {label}
        </td>
    </tr>
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700 rounded-lg">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {headers.map((header, i) => (
              <th key={i} className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 ${i === 0 ? 'text-gray-700 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800">
          {renderSectionHeader('Assets')}
          {assetCategories.map(cat => renderDataRow(cat, 'assets'))}
          <AddCategoryRow type="assets" onAddCategory={onAddCategory} colSpan={headers.length} />
          {renderSummaryRow(summaryRows.find(r => r.key === 'totalAsset'))}
          {renderSummaryRow(summaryRows.find(r => r.key === 'diffInTotalAsset'))}
          {renderSummaryRow(summaryRows.find(r => r.key === 'myAssets'))}
          
          {renderSectionHeader('Liabilities')}
          {liabilityCategories.map(cat => renderDataRow(cat, 'liabilities'))}
          <AddCategoryRow type="liabilities" onAddCategory={onAddCategory} colSpan={headers.length} />
          {renderSummaryRow(summaryRows.find(r => r.key === 'totalLiability'))}

          {renderSectionHeader('Net Summary')}
          {renderSummaryRow(summaryRows.find(r => r.key === 'net'))}
          {renderSummaryRow(summaryRows.find(r => r.key === 'percentageChange'))}
          {renderSummaryRow(summaryRows.find(r => r.key === 'diffInNet'))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-end">
        <button
          onClick={onAddMonth}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition"
        >
          Add Month
        </button>
      </div>
    </div>
  );
};

export default DataTable;
