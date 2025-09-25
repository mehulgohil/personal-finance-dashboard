import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { MonthlyData, ProcessedMonthlyData } from './types';
import Header from './components/Header';
import DataTable from './components/DataTable';
import SummaryCards from './components/SummaryCards';
import NetWorthChart from './components/NetWorthChart';
import AllocationChart from './components/AllocationChart';
import AssetCompositionChart from './components/AssetCompositionChart';

const API_URL = 'http://localhost:3001/api';

const App: React.FC = () => {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await fetch(`${API_URL}/data`);
      if (!response.ok) {
        throw new Error('Failed to fetch data from the server.');
      }
      const fetchedData = await response.json();
      setData(fetchedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const { assetCategories, liabilityCategories } = useMemo(() => {
    const assetSet = new Set<string>();
    const liabilitySet = new Set<string>();
    data.forEach(month => {
      if (month.assets) Object.keys(month.assets).forEach(key => assetSet.add(key));
      if (month.liabilities) Object.keys(month.liabilities).forEach(key => liabilitySet.add(key));
    });
    return {
      assetCategories: Array.from(assetSet).sort(),
      liabilityCategories: Array.from(liabilitySet).sort(),
    };
  }, [data]);

  const handleDataChange = useCallback(async (rowIndex: number, type: 'assets' | 'liabilities', category: string, value: string) => {
    const numericValue = value === '' ? 0 : parseFloat(value);
    if (isNaN(numericValue)) return;

    // Optimistic UI update
    const oldData = [...data];
    const newData = data.map((row, index) => {
        if (index === rowIndex) {
            return {
                ...row,
                [type]: {
                    ...row[type],
                    [category]: numericValue
                }
            };
        }
        return row;
    });
    setData(newData);

    // API call
    try {
        const response = await fetch(`${API_URL}/data/entry`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: data[rowIndex].date, type, category, value: numericValue })
        });
        if (!response.ok) throw new Error('Failed to save changes.');
    } catch (err) {
        // Revert on error
        setData(oldData);
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    }
  }, [data]);
  
  const handleAddCategory = useCallback(async (type: 'assets' | 'liabilities', category: string) => {
    if (!category || (type === 'assets' && assetCategories.includes(category)) || (type === 'liabilities' && liabilityCategories.includes(category))) {
      alert('Category name cannot be empty or a duplicate.');
      return;
    }
    try {
        const response = await fetch(`${API_URL}/data/category`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, category })
        });
        if (!response.ok) throw new Error('Failed to add category.');
        await fetchData(); // Refetch data to get updated structure
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    }
  }, [assetCategories, liabilityCategories, fetchData]);

  const handleRemoveCategory = useCallback(async (type: 'assets' | 'liabilities', category: string) => {
    if (!window.confirm(`Are you sure you want to delete the "${category}" category? This will remove it from all months.`)) {
      return;
    }
     try {
        const response = await fetch(`${API_URL}/data/category`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, category })
        });
        if (!response.ok) throw new Error('Failed to remove category.');
        await fetchData(); // Refetch data
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    }
  }, [fetchData]);

  const handleAddMonth = useCallback(async () => {
    if (data.length === 0) return;
    try {
      const response = await fetch(`${API_URL}/data/month`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to add new month.');
      await fetchData(); // Refetch data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    }
  }, [data, fetchData]);
  
  const handleResetData = useCallback(async () => {
    if (window.confirm('Are you sure you want to reset all data? This will restore the original demo data and cannot be undone.')) {
        try {
            const response = await fetch(`${API_URL}/data/reset`, { method: 'POST' });
            if (!response.ok) throw new Error('Failed to reset data.');
            await fetchData(); // Refetch data
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        }
    }
  }, [fetchData]);

  const processedData: ProcessedMonthlyData[] = useMemo(() => {
    let lastTotalAsset = 0;
    let lastNet = 0;

    return data.map(month => {
        const totalAsset = Object.values(month.assets || {}).reduce((sum, val) => sum + val, 0);
        const totalLiability = Object.values(month.liabilities || {}).reduce((sum, val) => sum + val, 0);
        const net = totalAsset - totalLiability;
        const diffInTotalAsset = totalAsset - lastTotalAsset;
        const diffInNet = net - lastNet;
        const percentageChange = lastNet !== 0 ? (diffInNet / Math.abs(lastNet)) * 100 : 0;
        const myAssets = net;

        lastTotalAsset = totalAsset;
        lastNet = net;

        return {
            ...month,
            totalAsset, totalLiability, net, diffInTotalAsset, myAssets, percentageChange, diffInNet,
        };
    });
  }, [data]);
  
  const allocationData = useMemo(() => {
    if (processedData.length === 0) return { assetData: [], liabilityData: [] };
    const latestMonth = processedData[processedData.length - 1];
    const assetData = Object.entries(latestMonth.assets).map(([name, value]) => ({ name, value })).filter(item => item.value > 0);
    const liabilityData = Object.entries(latestMonth.liabilities).map(([name, value]) => ({ name, value })).filter(item => item.value > 0);
    return { assetData, liabilityData };
  }, [processedData]);

  const assetCompositionData = useMemo(() => data.map(month => ({ date: month.date, ...month.assets })), [data]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen text-white text-xl">Loading Financial Data...</div>
  }

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        {error && <div className="my-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700 rounded-lg">Error: {error}</div>}
        <main className="mt-8 space-y-8">
          <SummaryCards data={processedData} />
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Latest Month Snapshot</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-semibold mb-2 text-center text-gray-800 dark:text-gray-200">Asset Allocation</h3>
                    <AllocationChart data={allocationData.assetData} />
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-2 text-center text-gray-800 dark:text-gray-200">Liability Breakdown</h3>
                    <AllocationChart data={allocationData.liabilityData} />
                </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Asset Composition Trend</h2>
            <AssetCompositionChart data={assetCompositionData} assetCategories={assetCategories} />
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Net Worth Over Time</h2>
            <NetWorthChart data={processedData} />
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Details</h2>
              <button 
                onClick={handleResetData}
                className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition"
                aria-label="Reset all data to the original demo data"
              >
                Reset Data
              </button>
            </div>
            <DataTable 
              data={processedData} 
              assetCategories={assetCategories}
              liabilityCategories={liabilityCategories}
              onDataChange={handleDataChange}
              onAddMonth={handleAddMonth}
              onAddCategory={handleAddCategory}
              onRemoveCategory={handleRemoveCategory}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;