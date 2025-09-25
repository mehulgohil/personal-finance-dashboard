
import React, { useState, useCallback } from 'react';
import { generateFinancialInsights } from '../services/geminiService';
import type { ProcessedMonthlyData, Insight } from '../types';

interface InsightGeneratorProps {
  data: ProcessedMonthlyData[];
}

const InsightCard: React.FC<{ insight: Insight; icon: string }> = ({ insight, icon }) => (
  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
    <div className="flex items-start space-x-4">
      <div className="text-2xl">{icon}</div>
      <div>
        <h4 className="font-bold text-gray-900 dark:text-white">{insight.title}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{insight.explanation}</p>
        <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 font-medium">{insight.suggestion}</p>
      </div>
    </div>
  </div>
);

const InsightGenerator: React.FC<InsightGeneratorProps> = ({ data }) => {
  const [insights, setInsights] = useState<Insight[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateInsights = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setInsights(null);
    try {
      const result = await generateFinancialInsights(data);
      if (result) {
        setInsights(result);
      } else {
        setError('Failed to generate insights. The AI model returned an unexpected response.');
      }
    } catch (err) {
      setError('An error occurred while communicating with the AI model.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  return (
    <div>
      <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">AI Financial Advisor</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Click the button below to get personalized insights and suggestions based on your financial data from our AI assistant.
      </p>
      <button
        onClick={handleGenerateInsights}
        disabled={isLoading}
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
            </>
        ) : (
          'Generate Insights'
        )}
      </button>

      {error && <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700 rounded-lg">{error}</div>}
      
      {insights && (
        <div className="mt-6 space-y-4">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Your Financial Report:</h4>
          {insights.map((insight, index) => (
            <InsightCard key={index} insight={insight} icon={['💡', '📈', '🎯'][index % 3]} />
          ))}
        </div>
      )}
    </div>
  );
};

export default InsightGenerator;
